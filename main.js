const grid = document.getElementById('grid');
// Hafıza ismini 'vUltimate_Final' yaptık ki çakışma olmasın
let deckData = JSON.parse(localStorage.getItem('vUltimate_Final')) || Array(15).fill(null);

// DÜNYADAKİ TÜM ÖZEL PROTOKOLLER (GÜNCEL LİSTE)
const protocols = {
    "minecraft": "minecraft://", 
    "mc": "minecraft://",
    "edge": "microsoft-edge:https://www.google.com",
    "microsoft edge": "microsoft-edge:https://www.google.com",
    "store": "ms-windows-store://home",
    "discord": "discord://",
    "steam": "steam://",
    "spotify": "spotify://",
    "roblox": "roblox://",
    "hesap makinesi": "calculator://"
};

function draw() {
    grid.innerHTML = '';
    deckData.forEach((item, i) => {
        const div = document.createElement('div');
        div.className = 'key' + (item ? '' : ' empty');
        if (item) {
            const tagClass = item.type === 'APP' ? 'tag-app' : 'tag-web';
            div.innerHTML = `<img src="${item.logo}"><span>${item.name}</span><div class="tag ${tagClass}">${item.type}</div>`;
            div.onclick = () => {
                if (item.type === "APP") {
                    // MİNEKRAFT İÇİN ÖZEL "FORCE OPEN" MODU
                    if (item.name.includes("MINECRAFT") || item.name === "MC") {
                        // 1. Yol: Standart Protokol
                        window.location.assign("minecraft://");
                        // 2. Yol: 300ms sonra Launcher Protokolü (Java için)
                        setTimeout(() => { window.location.assign("ms-minecraft-launcher://"); }, 300);
                    } 
                    // EDGE İÇİN ÖZEL TETİKLEYİCİ
                    else if (item.name.includes("EDGE")) {
                        window.location.assign("microsoft-edge:https://www.google.com");
                    }
                    else {
                        window.location.assign(item.url);
                    }
                } else {
                    window.open(item.url, '_blank', 'width=1200,height=800');
                }
            };
        } else {
            div.innerHTML = '+';
            div.onclick = () => setup(i);
        }
        grid.appendChild(div);
    });
}

function setup(i) {
    const mode = prompt("1: UYGULAMA (Edge, Store, Minecraft vb.)\n2: SİTE (YouTube, Google vb.)");
    if (mode === "1") {
        const app = prompt("Uygulama adı:").toLowerCase().trim();
        if (!app) return;
        // Listede varsa al, yoksa ismine :// ekle
        let url = protocols[app] || (app.replace(/\s+/g, '') + "://");
        save(i, app.toUpperCase(), url, `https://www.google.com/s2/favicons?sz=128&domain=${app}.com`, "APP");
    } else if (mode === "2") {
        const name = prompt("İsim:");
        const url = prompt("URL (https:// ile):", "https://");
        if (name && url) {
            try {
                const domain = new URL(url).hostname;
                save(i, name, url, `https://www.google.com/s2/favicons?sz=128&domain=${domain}`, "WEB");
            } catch(e) { alert("Hata: URL geçersiz!"); }
        }
    }
}

function save(i, name, url, logo, type) {
    deckData[i] = { name, url, logo, type };
    localStorage.setItem('vUltimate_Final', JSON.stringify(deckData));
    draw();
}

function resetAll() {
    if(confirm("Tüm butonlar silinsin mi?")) {
        localStorage.removeItem('vUltimate_Final');
        location.reload();
    }
}

draw();