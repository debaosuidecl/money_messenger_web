const referMessageGenerator = ()=>{

    const domains = [
        "moneymessengernow.com"
    ]

    const referMessages = [
        "Do you want to earn while using an app? Check out money messenger, an amazing app that pays you to use it and its totally free. Get started today at {domain} and earn $240"
    ]


    const randomMessage = referMessages[Math.floor(Math.random()*referMessages.length)];
    const randomDomain = domains[Math.floor(Math.random()*domains.length)];
    


    return randomMessage.replace("{domain}", randomDomain )





}