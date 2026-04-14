from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route('/api/weather')
def get_weather():
    city = request.args.get('city', 'London')
    # Use Open-Meteo geocoding to get lat/lon
    geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=en&format=json"
    try:
        geo_res = requests.get(geo_url).json()
        if not geo_res.get('results'):
            return jsonify({'error': 'City not found'}), 404
            
        location = geo_res['results'][0]
        lat = location['latitude']
        lon = location['longitude']
        
        weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto"
        weather_res = requests.get(weather_url).json()
        
        return jsonify({
            'city': location['name'],
            'country': location.get('country', ''),
            'current': weather_res['current_weather'],
            'daily': weather_res['daily']
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
