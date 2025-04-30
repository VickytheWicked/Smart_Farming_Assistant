import requests
import google.generativeai as genai

# Configure your API keys
OWM_API_KEY = "85f98c812071049e612f75cea5f685e9"
GEMINI_API_KEY = "AIzaSyBfvw0mWPmkcwObtNS4UrjDDZeMlZXAzRw"

# Initialize Gemini model
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

def get_weather_by_coordinates(lat, lon):
    """
    Fetches current weather data for the given latitude and longitude.
    """
    url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OWM_API_KEY}&units=metric"
    response = requests.get(url)
    data = response.json()
    if data.get("cod") != 200:
        return None
    city = data["name"]
    description = data["weather"][0]["description"]
    temperature = data["main"]["temp"]
    humidity = data["main"]["humidity"]
    return city, description, temperature, humidity


def get_personalized_advice(lat, lon):
    """
    Generates personalized farming advice based on current weather conditions.
    """
    weather_data = get_weather_by_coordinates(lat, lon)
    if not weather_data:
        return "Unable to fetch weather data. Please check the coordinates or API key."
    
    city, description, temperature, humidity = weather_data
    
    prompt = (
        f"Current weather details:\n"
        f"- Location: {city}\n"
        f"- Description: {description}\n"
        f"- Temperature: {temperature}°C\n"
        f"- Humidity: {humidity}%\n\n"
        f"Based on the above weather conditions, provide personalized farming advice. "
        f"Suggest suitable crops to grow and any necessary precautions or care tips."
    )
    
    response = model.generate_content(prompt)
    return response.text


latitude = 15.3269251
longitude = 73.9334442

advice = get_personalized_advice(latitude, longitude)
print(advice)
