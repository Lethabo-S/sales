
from models.chatbot import format_prompt, generate_response

# Test the prompt formatting
user_query = "What was last month's top-selling product?"
prompt = format_prompt(user_query)
print("Prompt:\n", prompt)

# Test the LLM response
response = generate_response(user_query)
print("LLM Response:\n", response)