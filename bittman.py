import requests
import json
import math

q = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quote%20where%20symbol%20in%20(%22%5ESPX%22%2C%22%5EVIX%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback='

r = requests.get(q)
# print r.status_code
# print r.headers
# print r.content
string = ""
data = json.loads(r.content)
quotes = data['query']['results']['quote']
# print quotes
for quote in quotes:
	string += quote['symbol'] + "\n"
	string += quote['LastTradePriceOnly'] + "\n"

	if quote['symbol'] == '^SPX':
		spx = float(quote['LastTradePriceOnly'])
	elif quote['symbol'] == '^VIX':
		vix = float(quote['LastTradePriceOnly'])

std_dev = spx * vix/100. * math.sqrt(7/252.0)
string += "SPX is " + str(spx) + "\n"
string += "VIX is " + str(vix) + "\n"
string += "STD deviation is " + str(std_dev) + "\n"
string += "STD deviation / 2 is " + str(std_dev/2) + "\n"
string += "STD deviation / 4 is " + str(std_dev/4)

print string

bitt = {'stddev': std_dev, 'stddev2': std_dev/2, 'stddev4': std_dev/4}

with open('morning.json', 'wb') as outfile:
	json.dump(bitt, outfile)