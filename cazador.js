const puppeteer = require('puppeteer');

async function cazarURL() {
    console.log("🕵️ Iniciando bot cazador de Adsterra en GitHub Actions...");

    const browser = await puppeteer.launch({ 
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'] 
    });
    
    const page = await browser.newPage();

    // 1. Preparamos la trampa HTML con tu script exacto
    const html = `
    <!DOCTYPE html>
    <html>
    <body>
        <div id="pantalla" style="width:100vw; height:100vh; background:red;">TOCA AQUI</div>
        <script src="https://pl29430597.profitablecpmratenetwork.com/48/9f/d2/489fd23120820292cb2f5bba04598957.js"></script>
    </body>
    </html>
    `;

    // 2. Interceptamos TODAS las peticiones de red
    await page.setRequestInterception(true);
    
    page.on('request', request => {
        const url = request.url();
        
        // Ignoramos el script original, buscamos la URL a la que intenta redirigir
        if (url.includes('http') && !url.includes('pl29430597.profitablecpmratenetwork.com')) {
            console.log("\n=============================================");
            console.log("🎯 ¡URL DE POPUNDER CAPTURADA EXITOSAMENTE!");
            console.log("=============================================\n");
            console.log(url);
            console.log("\n=============================================\n");
            
            // Una vez cazada, cerramos el proceso
            process.exit(0); 
        }
        request.continue();
    });

    // 3. Cargamos la página
    await page.setContent(html);

    // 4. Le damos 2 segundos al script para que cargue
    await new Promise(r => setTimeout(r, 2000));

    console.log("👆 Simulando toque en la pantalla...");
    
    // 5. Hacemos clic para detonar el Popunder
    await page.click('#pantalla');

    // Esperamos un poco a ver si reacciona
    await new Promise(r => setTimeout(r, 5000));
    
    console.log("⚠️ No se capturó ninguna redirección. Quizás el script requiere otra interacción.");
    await browser.close();
}

cazarURL();

//detonando el cazador
