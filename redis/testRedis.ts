import Redis from "ioredis";

const testRedis = async () : Promise<void> => {

    const redisClient  = new Redis({
        host: "localhost",
        port: 6379
    })

    await redisClient.set("name" , "sulaiman");
    redisClient.quit()
    return;
} 


const main = async() =>{
    await testRedis();
    return;
}

main();
