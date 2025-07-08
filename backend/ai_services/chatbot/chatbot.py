# from embeddings import retrieve_chunks
# from chat_history import save_chat, fetch_chat
# from openai import OpenAI
# from dotenv import load_dotenv

# load_dotenv("../.env")


# PROMPT = """
#     You are a chatbot specializing in laptop recommendations based on user usecases and requirements. You need to give the response in a very structured format. Mention the name of the specs and its value properly. Use Pakistani Rupees PKR as the unit of price instead of INR. Keep the conversation engaging. Make the conversion as engaging as possible for instance if I user just tell you the use case without mentioning any specific brand or price range, ask the user about these things and other that can help you give better response in terms of laptop recommendation. And the laptops that you recommend must be from the ones stored in the chromadb database.You must response in the language that user has asked question in. If a user asks a question other than laptops just simply say "I'm sorry I can't respond to that. You can ask me about laptop recommendations." but if they ask whether you can respond in a particular language make sure to reply to them with a yes in that language. If a users asks you about a laptop that is in your database, you can give him the deatils of it and for which use case it will be best. However if a user asks about a certain laptop or brand that is not in your database you can reply "I don't have information about this particular model/brand in my database".
#     You will recommend laptops from here {data}
#     This is the question : {question}
    
# """


# def call_open_ai(messages):
#     client = OpenAI()
#     response = client.chat.completions.create(
#         temperature=0.7,  
#         model="gpt-4o-mini",   
#         messages=messages
#     )
#     return response.choices[0].message.content

# def retrieve_context(question):
#     docs = retrieve_chunks(question)
#     text = [doc.page_content for doc in docs]
#     combined_text = " ".join(text)
#     return combined_text

# def prepare_messages(question, user_id, combined_text):
#     history = fetch_chat(user_id)
#     clean_history = [
#         {"role": item["role"], "content": item["content"]} for item in history
#     ]

#     messages = [
#         {"role": "system", "content": PROMPT},
#         {"role": "system", "content": f"Context: {combined_text}"},
#     ]
#     messages.extend(clean_history)
#     messages.append({"role": "user", "content": question})
#     return messages

# def bot(question, user_id):
#     combined_text = retrieve_context(question)
    
#     messages = prepare_messages(question, user_id, combined_text)

#     user_chat = {
#         "user_id": user_id,
#         "role": "user",
#         "content": question
#     }
#     save_chat(user_chat)

#     response = call_open_ai(messages)

#     ai_chat = {
#         "user_id": user_id,
#         "role": "assistant",
#         "content": response
#     }
#     save_chat(ai_chat)

#     return response











from .embeddings import retrieve_chunks
from .chat_history import save_chat, fetch_chat
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv("../.env")

# PROMPT = '''
# You are a chatbot specializing in laptop recommendations based on user usecases and requirements. 
# You need to give the response in a very structured format. Mention the name of the specs and its value properly. 
# Use Pakistani Rupees PKR as the unit of price instead of INR. Keep the conversation engaging. 
# Make the conversion as engaging as possible—for instance, if a user just tells you the use case without mentioning 
# any specific brand or price range, ask the user about these things and other that can help you give better response in 
# terms of laptop recommendation. And the laptops that you recommend must be from the ones stored in the chromadb database.
# You must respond in the language that user has asked the question in. 
# If a user asks a question other than laptops, just simply say: 
# "I'm sorry I can't respond to that. You can ask me about laptop recommendations." 
# If they ask whether you can respond in a particular language, make sure to reply to them with a yes in that language. 
# If a user asks about a laptop that is in your database, you can give him the details of it and for which use case it will be best. 
# However, if a user asks about a certain laptop or brand that is not in your database you can reply 
# "I don't have information about this particular model/brand in my database".

# You will recommend laptops from here {data}
# This is the question: {question}
# '''

PROMPT = '''
You are a chatbot specializing in laptop recommendations based on user usecases and requirements. 
You need to give the response in a very structured format. Mention the name of the specs and its value properly. Also mention the seller of that laptop. 
Use Pakistani Rupees PKR as the unit of price instead of INR. Keep the conversation engaging. 
Make the conversion as engaging as possible—for instance, if a user just tells you the use case without mentioning 
any specific brand or price range, ask the user about these things and other that can help you give better response in 
terms of laptop recommendation. And the laptops that you recommend must be from the ones stored in the chromadb database.
You must respond in the language that user has asked the question in. 
If a user asks a question other than laptops, just simply say: 
"I'm sorry I can't respond to that. You can ask me about laptop recommendations." 
If they ask whether you can respond in a particular language, make sure to reply to them with a yes in that language. 
If a user asks about a laptop that is in your database, you can give him the details of it and for which use case it will be best. 
However, if a user asks about a certain laptop or brand that is not in your database you can reply 
"I don't have information about this particular model/brand in my database".

If the user seems to be inquiring about a specific laptop (e.g., mentions a model name or asks "can I ask about a laptop?"), 
then politely respond: "Yes, please tell me the model name you're interested in." if they haven't mentioned it yet.

If they mention a laptop model and it exists in your database, return its full details and which use-cases it's best suited for.

If the model doesn't exist in your database, respond with: 
"I don't have information about this particular model/brand in my database."

You will recommend laptops from here {data}
This is the question: {question}
'''

def call_open_ai(messages):
    client = OpenAI()
    response = client.chat.completions.create(
        temperature=0.7,
        model="gpt-4o-mini",
        messages=messages
    )
    return response.choices[0].message.content

# def retrieve_context(question):
#     docs = retrieve_chunks(question)
#     text = [doc.page_content for doc in docs]
#     return " ".join(text)

def retrieve_context(question):
    from langchain_core.documents import Document

    docs = retrieve_chunks(question, top_k=4)  # Keep top-k flexible
    exact_match = None

    # Try to identify a laptop name directly from vector store result
    for doc in docs:
        if "Name:" in doc.page_content:
            laptop_name = doc.page_content.split("Name:")[1].split("\n")[0].strip().lower()
            if laptop_name in question.lower():
                exact_match = doc
                break

    if exact_match:
        print("🎯 Exact laptop match found.")
        return exact_match.page_content
    else:
        print("💬 Returning blended chunks.")
        return " ".join([doc.page_content for doc in docs])

def is_model_inquiry(question: str) -> bool:
    keywords = [
        "inquire", "know about", "information about", "details of",
        "tell me about", "specs of", "model", "is good for", "is suitable for",
        "is this good", "worth buying", "what about", "can I ask about"
    ]
    
    lowered = question.lower()
    return any(keyword in lowered for keyword in keywords)


def prepare_messages(question, user_id, combined_text):
    history = fetch_chat(user_id)
    clean_history = [
        {"role": item["role"], "content": item["content"]} for item in history
    ]
    messages = [
        {"role": "system", "content": PROMPT},
        {"role": "system", "content": f"Context: {combined_text}"},
    ]
    messages.extend(clean_history)
    messages.append({"role": "user", "content": question})
    return messages

def bot(question, user_id):
    combined_text = retrieve_context(question)
    messages = prepare_messages(question, user_id, combined_text)
    save_chat({ "user_id": user_id, "role": "user", "content": question })
    response = call_open_ai(messages)
    save_chat({ "user_id": user_id, "role": "assistant", "content": response })
    return response
