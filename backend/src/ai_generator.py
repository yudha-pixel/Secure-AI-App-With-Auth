import logging
import os
import json

from huggingface_hub import InferenceClient
from typing import Dict, Any
from dotenv import load_dotenv

load_dotenv()

client = InferenceClient(provider="featherless-ai", api_key=os.getenv("HUGGINGFACE_API_KEY"))

def generate_challenge_with_ai(difficulty: str) -> Dict[str, Any]:
    system_prompt = f"""
    [INST]
    You are an expert coding challenge creator. 
    Your task is to generate a coding question with multiple choice answers.
    The question should be appropriate for the specified difficulty level.

    For easy questions: Focus on basic syntax, simple operations, or common programming concepts.
    For medium questions: Cover intermediate concepts like data structures, algorithms, or language features.
    For hard questions: Include advanced topics, design patterns, optimization techniques, or complex algorithms.

    Return the challenge in the following JSON structure:
    &#123;
        "title": "The question title",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correct_answer_id": 0, // Index of the correct answer (0-3)
        "explanation": "Detailed explanation of why the correct answer is right"
    &#125;

    Make sure the options are plausible but with only one clearly correct answer.
    [/INST]
    """

    try:
        response = client.chat.completions.create(
            model="mistralai/Mistral-7B-Instruct-v0.2",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Generate a {difficulty} difficulty coding challenge."}
            ],
            response_format={"type": "json_object"},
            temperature=0.7,
            max_tokens=1024,
        )

        # TODO: check if response is valid
        content = response.choices[0].message.content
        challenge_data = json.loads(content)

        required_fields = ["title", "options", "correct_answer_id", "explanation"]
        for field in required_fields:
            if field not in challenge_data:
                raise ValueError(f"Missing required field: {field}")

        return challenge_data


    except Exception as e:
        logging.error("Error generating challenge with AI:", e)
        return {
            'title': 'Basic Python List Operations',
            'options': [
                "my_list.append(5)",
                "my_list.add(5)",
                "my_list.push(5)",
                "my_list.insert(5)",
            ],
            "correct_answer_id": 0,
            "explanation": "In Python, append() is the correct method to add an element to the end of a list."
        }


