const puppeteer = require('puppeteer');

async function cazarURL() {
    console.log("🕵️ Iniciando bot cazador V3 (Modo Sigilo Anti-Detección)...");

    const browser = await puppeteer.launch({ 
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox', 
            '--disable-popup-blocking'
        ] 
    });
    
    const page = await browser.newPage();

    // 1. CAMUFLAJE: Falsificamos el User Agent para parecer un navegador normal de Windows
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // 2. MODO NINJA: Borramos la variable interna que delata a Puppeteer como Bot
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });

    // 3. EL RADAR DE PESTAÑAS
    browser.on('targetcreated', async (target) => {
        if (target.type() === 'page') {
            const newPage = await target.page();
            if (newPage) {
                newPage.on('request', request => {
                    const url = request.url();
                    // Filtramos para agarrar la ruta pura
                    if (url.startsWith('http') && !url.includes('pl29430597')) {
                        console.log("\n=============================================");
                        console.log("🎯 ¡BINGO! URL PURA CAPTURADA:");
                        console.log("=============================================\n");
                        console.log(url);
                        console.log("\n=============================================\n");
                        process.exit(0);
                    }
                });
            }
        }
    });

    // 4. LA TRAMPA HTML MEJORADA
    const html = `
    <!DOCTYPE html>
    <html>
    <head><title>Test</title></head>
    <body style="width: 100vw; height: 100vh; margin: 0; background: white;">
        <button id="pantalla" style="width:100%; height:100%; position:absolute; z-index:9999; opacity:0.1;">TOCAR</button>
        <script src="https://pl29430597.profitablecpmratenetwork.com/48/9f/d2/489fd23120820292cb2f5bba04598957.js"></script>
    </body>
    </html>
    `;

    await page.setContent(html);

    console.log("⏳ Dejando que Adsterra analice el entorno (5 segundos)...");
    await new Promise(r => setTimeout(r, 5000));

    console.log("👆 Ejecutando clics de simulacion...");
    
    // Disparamos clics desde adentro de la página (como un humano)
    await page.evaluate(() => {
        document.getElementById('pantalla').click();
        document.body.click();
    });
    
    // Y también clics del mouse desde afuera por si acaso
    await page.mouse.click(200, 200);
    await page.mouse.click(400, 400);

    // Esperamos el resultado
    await new Promise(r => setTimeout(r, 6000));
    
    console.log("⚠️ Falló de nuevo. La seguridad de Adsterra está demasiado alta para bots simples.");
    await browser.close();
    process.exit(1);
}

cazarURL();
