import json  
import time
import requests  
from kafka import KafkaProducer  

# Initialize Kafka producer  

producer = KafkaProducer(bootstrap_servers='localhost:9092', value_serializer=lambda v: json.dumps(v).encode('utf-8'));  

# Weather API configuration  

api_key = 'ea3051e935c22f344513efd8f59f10f3'  

city = 'Belgrade'  

lat=44.787197 

lon=20.457273 

weather_api_url = f'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}'  

# Fetch weather data from the Weather API  



def fetch():
    try:
        response = requests.get(weather_api_url)
        
        if response.status_code == 200:
            weather_data = response.json()
            return weather_data
        else:
            print(f"Could fetch data from API: {response.status_code}")
            return None
    except Exception as e:
        print(f"Exception occured:{str(e)}")
        return None

def send_data():
    while True:
        weather_data = fetch()
        if weather_data:
            producer.send('raw-weather',value=weather_data)
            print("Sent data to Kafka:", weather_data)

        time.sleep(10)

if __name__ == "__main__":
    send_data()