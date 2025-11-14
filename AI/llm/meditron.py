from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

tokenizer = AutoTokenizer.from_pretrained("epfl-llm/meditron-7b")
def activate_model():
    # Load tokenizer & model

    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = AutoModelForCausalLM.from_pretrained(
        "epfl-llm/meditron-7b",
        torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
        device_map=device
    )
    return model 

def ask_model(model: AutoModelForCausalLM):
    prompt = "My back hurts... which professional should I see?"

    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

    output_tokens = model.generate(
        **inputs,
        max_new_tokens=256,
        do_sample=True,
        temperature=0.2,
        top_p=0.9
    )

    response = tokenizer.decode(output_tokens[0], skip_special_tokens=True)
    return response

if __name__ == "__main__":
    print(ask_model(activate_model()))
