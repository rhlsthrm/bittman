import json
import requests

with open('morning.json', 'rb') as json_data:
    bitt_data = json.load(json_data)

q = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quote%20where%20symbol%20in%20(%22%5ESPX%22%2C%22%5EVIX%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback='
r = requests.get(q)

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

bitt_data['spx_open'] = spx
bitt_data['spx_openplus4'] = spx + bitt_data['stddev4']
bitt_data['spx_openplus2'] = spx + bitt_data['stddev2']
bitt_data['spx_openminus4'] = spx - bitt_data['stddev4']
bitt_data['spx_openminus2'] = spx - bitt_data['stddev2']

print "SPX open: " + str(bitt_data['spx_open'])
print "SPX trigger point low: " + str(bitt_data['spx_openminus4'])
print "SPX trigger point high: " + str(bitt_data['spx_openplus4'])
print "SPX spread point low: " + str(bitt_data['spx_openminus2'])
print "SPX spread point high: " + str(bitt_data['spx_openplus2'])

with open('triggers.json', 'wb') as outfile:
    json.dump(bitt_data, outfile)