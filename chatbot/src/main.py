"""Точка входа для чат-бота"""

from agent.main_agent import MainAgent
import os
from dotenv import load_dotenv

load_dotenv()


def main():
    """Главная функция для запуска чат-бота"""
    
    # Проверка переменных окружения
    if not os.getenv("OPENAI_API_KEY"):
        print("❌ ОШИБКА: OPENAI_API_KEY не установлен в .env файле")
        print("Создайте файл .env и добавьте OPENAI_API_KEY=your_key_here")
        return
    
    print("🚀 Инициализация чат-бота Tour Booking...")
    print(f"📡 Backend URL: {os.getenv('BACKEND_URL', 'http://localhost:8000')}")
    print(f"🤖 Model: {os.getenv('OPENAI_MODEL', 'gpt-4-turbo-preview')}\n")
    
    # Создание агента
    try:
        agent = MainAgent()
        print("✅ Чат-бот готов к работе!")
        print("💡 Введите 'exit' или 'quit' для выхода")
        print("💡 Введите 'clear' для очистки истории разговора\n")
    except Exception as e:
        print(f"❌ Ошибка при инициализации агента: {str(e)}")
        return
    
    session_id = "default"
    
    while True:
        try:
            user_input = input("Вы: ").strip()
            
            if not user_input:
                continue
            
            if user_input.lower() in ["exit", "quit", "выход"]:
                print("\n👋 До свидания!")
                break
            
            if user_input.lower() in ["clear", "очистить"]:
                agent.clear_session(session_id)
                print("✅ История разговора очищена\n")
                continue
            
            # Обработка запроса
            print("\n🤔 Думаю...")
            response = agent.process(user_input, session_id)
            
            output = response.get('output', 'Не удалось получить ответ')
            print(f"\n🤖 Бот: {output}\n")
            
        except KeyboardInterrupt:
            print("\n\n👋 До свидания!")
            break
        except Exception as e:
            print(f"\n❌ Ошибка: {str(e)}\n")


if __name__ == "__main__":
    main()

