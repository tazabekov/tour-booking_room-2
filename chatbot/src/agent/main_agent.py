"""Главный агент с архитектурой и поддержкой tools"""

from langchain.agents import AgentExecutor, create_openai_tools_agent
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from typing import Dict, Any, List
import os
from dotenv import load_dotenv

try:
    # Попытка относительного импорта (когда запускается как модуль)
    from ..prompts.system_prompts import SYSTEM_PROMPT
    from ..tools.tool_registry import create_tools
    from ..memory.conversation_memory import ConversationMemory
except ImportError:
    # Абсолютный импорт (когда импортируется из бэкенда)
    from prompts.system_prompts import SYSTEM_PROMPT
    from tools.tool_registry import create_tools
    from memory.conversation_memory import ConversationMemory

load_dotenv()


class MainAgent:
    """Главный агент с поддержкой tools для работы с бэкендом"""
    
    def __init__(self):
        # Инициализация LLM
        self.llm = ChatOpenAI(
            model=os.getenv("OPENAI_MODEL", "gpt-4-turbo-preview"),
            temperature=float(os.getenv("AGENT_TEMPERATURE", "0.7")),
            api_key=os.getenv("OPENAI_API_KEY")
        )
        
        # Создание всех инструментов для работы с бэкендом
        self.tools = create_tools()
        
        # Память разговоров
        self.memory = ConversationMemory()
        
        # Создание промпта для агента
        prompt = ChatPromptTemplate.from_messages([
            ("system", SYSTEM_PROMPT),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "{input}"),
            MessagesPlaceholder(variable_name="agent_scratchpad"),
        ])
        
        # Создание агента с поддержкой tools
        agent = create_openai_tools_agent(
            llm=self.llm,
            tools=self.tools,
            prompt=prompt
        )
        
        # Создание executor для выполнения агента
        self.agent_executor = AgentExecutor(
            agent=agent,
            tools=self.tools,
            verbose=os.getenv("VERBOSE", "false").lower() == "true",
            handle_parsing_errors=True,
            max_iterations=5,
            return_intermediate_steps=False
        )
    
    def process(self, query: str, session_id: str = "default") -> Dict[str, Any]:
        """
        Обработать запрос пользователя
        
        Args:
            query: Запрос пользователя
            session_id: ID сессии для памяти
        
        Returns:
            Ответ агента
        """
        # Получаем память для сессии
        memory = self.memory.get_memory(session_id)
        chat_history = memory.chat_memory.messages
        
        try:
            # Выполняем запрос через агента с tools
            result = self.agent_executor.invoke({
                "input": query,
                "chat_history": chat_history
            })
            
            # Сохраняем в память
            memory.chat_memory.add_user_message(query)
            output_text = result.get("output", "")
            memory.chat_memory.add_ai_message(output_text)
            
            return result
        except Exception as e:
            error_message = f"Произошла ошибка при обработке запроса: {str(e)}"
            # Сохраняем ошибку в память
            memory.chat_memory.add_user_message(query)
            memory.chat_memory.add_ai_message(error_message)
            
            return {
                "output": error_message,
                "error": str(e)
            }
    
    def clear_session(self, session_id: str):
        """Очистить память сессии"""
        self.memory.clear_memory(session_id)

