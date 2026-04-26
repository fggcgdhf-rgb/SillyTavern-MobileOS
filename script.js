import { characters, character_id, getCharacters } from "../../../script.js";
import { saveSettings, extension_settings } from "../../extensions.js";

const MODULE_NAME = "ultimate-phone";

function initPhone() {
    // สร้าง HTML สำหรับมือถือ
    const phoneHtml = `
        <div id="phone-fab">📱</div>
        <div id="phone-wrapper" class="hidden">
            <div class="phone-status-bar">
                <span id="phone-time">12:00</span>
                <span>📶 🔋 100%</span>
            </div>
            <div id="phone-screen-content">
                <div id="phone-home" class="app-grid">
                    <div class="app-item" data-app="ig"><div class="icon ig-icon">📸</div><span>IG</span></div>
                    <div class="app-item" data-app="line"><div class="icon line-icon">💬</div><span>Line</span></div>
                    <div class="app-item" data-app="tiktok"><div class="icon tt-icon">🎵</div><span>TikTok</span></div>
                    <div class="app-item" data-app="music"><div class="icon mu-icon">🎧</div><span>Music</span></div>
                    <div class="app-item" data-app="pet"><div class="icon pet-icon">🐾</div><span>Pet</span></div>
                </div>
                <div id="app-window" class="hidden">
                    <div class="app-header">
                        <button id="btn-back">⬅️</button>
                        <span id="app-title">App</span>
                    </div>
                    <div id="app-body"></div>
                </div>
            </div>
        </div>
    `;

    $('body').append(phoneHtml);
    setupEventListeners();
    updateClock();
}

function setupEventListeners() {
    // เปิด-ปิดมือถือ
    $('#phone-fab').on('click', () => $('#phone-wrapper').toggleClass('hidden'));

    // เลือกแอป
    $('.app-item').on('click', function() {
        const app = $(this).data('app');
        launchApp(app);
    });

    // ปุ่มย้อนกลับ
    $('#btn-back').on('click', () => {
        $('#app-window').addClass('hidden');
        $('#phone-home').removeClass('hidden');
    });
}

function launchApp(app) {
    $('#phone-home').addClass('hidden');
    $('#app-window').removeClass('hidden');
    const charName = characters[character_id]?.name || "Character";
    
    let content = "";
    if (app === 'ig') {
        content = `
            <div class="ig-header"><b>${charName}</b></div>
            <div class="ig-story">🟣 Story</div>
            <div class="ig-post"><img src="${characters[character_id]?.avatar}" style="width:100%"></div>
            <div class="ig-actions">❤️ 💬 ✈️</div>
            <div class="ig-comments"><b>User:</b> สวยมากครับ!</div>
        `;
    } else if (app === 'pet') {
        content = `
            <div class="pet-game">
                <p>Status: Happy 😊</p>
                <div class="pet-emoji" style="font-size:50px">🐱</div>
                <button onclick="alert('Feeding...')">🍗 ให้อาหาร</button>
                <button onclick="alert('Cleaning...')">🛁 อาบน้ำ</button>
            </div>
        `;
    }
    
    $('#app-body').html(content);
    $('#app-title').text(app.toUpperCase());
}

function updateClock() {
    const now = new Date();
    $('#phone-time').text(now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0'));
    setTimeout(updateClock, 10000);
}

jQuery(document).ready(initPhone);
// ระบบบันทึกความจำส่งไปให้ AI
function updateAIKnowledge(newInfo) {
    const currentNotes = extension_settings[MODULE_NAME]?.notes || "";
    const updatedNotes = currentNotes + "\n" + newInfo;
    
    // บันทึกข้อมูลลงใน Extension Settings ของ SillyTavern
    extension_settings[MODULE_NAME].notes = updatedNotes;
    saveSettings();
    
    // แจ้งเตือนผู้ใช้
    toastr.success("บันทึกความจำลงในระบบสมอง AI แล้ว");
}
