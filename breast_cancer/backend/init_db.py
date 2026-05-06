# import asyncio
# from sqlalchemy import text
# from app.core.database import engine
# from app.core.security import hash_password

# async def seed_db():
#     async with engine.begin() as conn:
#         # 1. Create table if it doesn't exist
#         await conn.execute(text("""
#             CREATE TABLE IF NOT EXISTS users (
#                 id INTEGER PRIMARY KEY AUTOINCREMENT,
#                 email TEXT UNIQUE NOT NULL,
#                 hashed_password TEXT NOT NULL,
#                 full_name TEXT NOT NULL,
#                 role TEXT NOT NULL,
#                 is_active INTEGER DEFAULT 1
#             )
#         """))
        
#         # 2. Insert first admin
#         try:
#             await conn.execute(
#                 text("INSERT INTO users (email, hashed_password, full_name, role) VALUES (:e, :p, :n, :r)"),
#                 {
#                     "e": "admin@cancerai.com",
#                     "p": hash_password("admin123"),
#                     "n": "System Admin",
#                     "r": "admin"
#                 }
#             )
#             print("Admin created: admin@cancerai.com / admin123")
#         except Exception as e:
#             print("Admin probably already exists.")

# if __name__ == "__main__":
#     asyncio.run(seed_db())




import asyncio
from sqlalchemy import text
from app.core.database import engine
from app.core.security import hash_password

async def reset():
    async with engine.begin() as conn:
        # 1. Drop and Recreate
        await conn.execute(text("DROP TABLE IF EXISTS users"))
        await conn.execute(text("""
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                hashed_password TEXT NOT NULL,
                full_name TEXT NOT NULL,
                role TEXT NOT NULL,
                is_active INTEGER DEFAULT 1
            )
        """))
        
        # 2. Insert Admin (Password: admin123)
        await conn.execute(
            text("INSERT INTO users (email, hashed_password, full_name, role) VALUES (:e, :p, :n, :r)"),
            {
                "e": "admin@cancerai.com",
                "p": hash_password("admin123"),
                "n": "Welcome Admin",
                "r": "admin"
            }
        )
    

if __name__ == "__main__":
    asyncio.run(reset())