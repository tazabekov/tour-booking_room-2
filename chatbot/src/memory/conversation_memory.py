"""Память для хранения контекста разговоров"""

from langchain.memory import ConversationBufferMemory
from langchain.schema import BaseMemory
from typing import Dict, Any, List
import os


class ConversationMemory:
    """Управление памятью разговоров"""
    
    def __init__(self):
        self.memories: Dict[str, BaseMemory] = {}
    
    def get_memory(self, session_id: str) -> BaseMemory:
        """Получить память для сессии"""
        if session_id not in self.memories:
            self.memories[session_id] = ConversationBufferMemory(
                memory_key="chat_history",
                return_messages=True,
                output_key="output"
            )
        return self.memories[session_id]
    
    def clear_memory(self, session_id: str):
        """Очистить память для сессии"""
        if session_id in self.memories:
            del self.memories[session_id]
    
    def get_chat_history(self, session_id: str) -> List:
        """Получить историю разговора для сессии"""
        memory = self.get_memory(session_id)
        return memory.chat_memory.messages


