import random
def is_spoiler(text: str):
    if random.randint(0, 1) == 0:
        return "This is not a spoiler!"
    else:
        return "This is a spoiler!"