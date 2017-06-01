import os
import sys
import csv
import tornado.ioloop
import tornado.web
from tornado.httpclient import AsyncHTTPClient
from lib.split.SplitHandler import SplitHandler
    
if __name__ == '__main__':
    # Setup the data
    
    # Settings
    root = os.path.dirname(__file__)
    port = int(os.environ.get('WORD_PUZZLES_SERVICE_PORT', '8888'))
    ip = '0.0.0.0'
    useMockup = False

    settings = {
        "static_path": root,
        "cookie_secret": "a6301483f77f60",
        "xsrf_cookies": True,
    }
    
    # Build application
    application = tornado.web.Application([
        (r"/split/entry", SplitHandler),
        (r"/(.*)", tornado.web.StaticFileHandler, {"path": root, "default_filename": "public/index.html"}),
    ])
    
    # Run
    try:
        application.listen(port, ip)
        tornado.ioloop.IOLoop.instance().start()
    except KeyboardInterrupt as e:
        print(str(e))