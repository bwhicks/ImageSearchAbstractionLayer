##Bing Image Search Abstraction Layer

This is a very simple API that takes requests to Bing's image search API
and returns them in JSON format. 

##Routes

/ - instructions for API use

/isal/query?offset=x - search for 'query' with an offset (page #) of x

/latest/ - returns the latest 10 searches
