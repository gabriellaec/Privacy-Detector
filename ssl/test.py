import asyncio

from ssllabs import Ssllabs

async def analyze():
    ssllabs = Ssllabs()
    return await ssllabs.analyze(host="devolo.de")

asyncio.run(analyze())