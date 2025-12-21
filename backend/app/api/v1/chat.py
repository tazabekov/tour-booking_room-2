"""API endpoints for chat functionality"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
import sys
import os
from dotenv import load_dotenv
import asyncio

# Добавляем путь к chatbot в sys.path
# Путь от backend/app/api/v1/chat.py к корню проекта, затем к chatbot
backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
project_root = os.path.dirname(backend_dir)
chatbot_path = os.path.join(project_root, "chatbot")
chatbot_src_path = os.path.join(chatbot_path, "src")
if chatbot_src_path not in sys.path:
    sys.path.insert(0, chatbot_src_path)

# Загружаем .env из chatbot директории
chatbot_env_path = os.path.join(chatbot_path, ".env")
if os.path.exists(chatbot_env_path):
    load_dotenv(chatbot_env_path)

router = APIRouter()

# Глобальный экземпляр агента (инициализируется при первом запросе)
_agent_instance = None
_agent_module_loaded = False


def get_agent():
    """Получить экземпляр агента (lazy initialization)"""
    global _agent_instance, _agent_module_loaded
    if _agent_instance is None or not _agent_module_loaded:
        try:
            # Импортируем из chatbot/src/agent/main_agent.py
            import importlib
            import sys
            
            # Принудительно перезагружаем модули для обновления кода
            modules_to_reload = ['agent.main_agent', 'tools.backend_tools', 'tools.tool_registry']
            for module_name in modules_to_reload:
                if module_name in sys.modules:
                    importlib.reload(sys.modules[module_name])
            
            from agent.main_agent import MainAgent
            _agent_instance = MainAgent()
            _agent_module_loaded = True
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            raise HTTPException(
                status_code=500,
                detail=f"Не удалось инициализировать чат-бота: {str(e)}\nДетали: {error_details}"
            )
    return _agent_instance


class ChatRequest(BaseModel):
    """Запрос на обработку сообщения"""
    message: str = Field(..., min_length=1, description="Сообщение пользователя")
    session_id: Optional[str] = Field("default", description="ID сессии для сохранения контекста")


class ChatResponse(BaseModel):
    """Ответ чат-бота"""
    response: str = Field(..., description="Ответ чат-бота")
    session_id: str = Field(..., description="ID сессии")


@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Обработать сообщение пользователя через AI чат-бота.
    
    Чат-бот использует инструменты для получения данных о турах из базы данных.
    """
    try:
        agent = get_agent()
        # Запускаем синхронный код агента в отдельном потоке, чтобы избежать блокировки
        result = await asyncio.to_thread(agent.process, request.message, request.session_id or "default")
        
        response_text = result.get("output", "Не удалось получить ответ")
        return ChatResponse(
            response=response_text,
            session_id=request.session_id or "default"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при обработке сообщения: {str(e)}"
        )


@router.post("/clear", response_model=dict)
async def clear_chat(session_id: Optional[str] = "default"):
    """Очистить историю разговора для указанной сессии"""
    try:
        agent = get_agent()
        agent.clear_session(session_id or "default")
        return {"message": "История разговора очищена", "session_id": session_id or "default"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при очистке истории: {str(e)}"
        )

