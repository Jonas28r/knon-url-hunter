const puppeteer = require('puppeteer');

async function cazarURL() {
    console.log("🕵️ Iniciando bot cazador V2 (Especial para Popunders)...");

    // Apagamos el bloqueador de Popups interno de Chrome
    const browser = await puppeteer.launch({ 
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox', 
            '--disable-popup-blocking' // ¡CRUCIAL!
        ] 
    });
    
    const page = await browser.newPage();

    // ¡LA TRAMPA MAESTRA! Escuchamos cuando se crea una NUEVA pestaña
    browser.on('targetcreated', async (target) => {
        if (target.type() === 'page') {
            const newPage = await target.page();
            if (newPage) {
                // Vigilamos el tráfico de red de la pestaña nueva
                newPage.on('request', request => {
                    const url = request.url();
                    // Filtramos el script original para agarrar la URL final
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

    // Preparamos el HTML trampa
    const html = `
    <!DOCTYPE html>
    <html>
    <body style="width: 100vw; height: 100vh; margin: 0;">
        <div id="pantalla" style="width:100%; height:100%; position:absolute; z-index:9999;"></div>
        <script src="https://pl29430597.profitablecpmratenetwork.com/48/9f/d2/489fd23120820292cb2f5bba04598957.js"></script>
    </body>
    </html>
    `;

    await page.setContent(html);

    console.log("⏳ Dejando que Adsterra prepare el popunder (4 segundos)...");
    await new Promise(r => setTimeout(r, 4000));

    console.log("👆 Simulando toque humano en la pantalla...");
    // Usamos un clic real del cursor en las coordenadas (x: 200, y: 200)
    await page.mouse.click(200, 200);

    // Esperamos a ver si reacciona
    await new Promise(r => setTimeout(r, 6000));
    
    console.log("⚠️ Falló la captura. Adsterra no disparó la ventana.");
    await browser.close();
    process.exit(1);
}

cazarURL();
