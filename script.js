document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
});

function toggleSettings() {
    const settingsPanel = document.querySelector('.settings-panel');
    settingsPanel.style.display = settingsPanel.style.display === 'none' || settingsPanel.style.display === '' ? 'block' : 'none';
}

function saveSettings() {
    const backgroundImageInput = document.getElementById('background-image');
    const customText = document.getElementById('custom-text').value;
    const reader = new FileReader();

    if (backgroundImageInput.files[0]) {
        reader.onload = function (event) {
            const backgroundImage = event.target.result;
            document.cookie = `backgroundImage=${encodeURIComponent(backgroundImage)};path=/;max-age=31536000`; // 1年
            applyBackgroundImage(backgroundImage);
        };
        reader.readAsDataURL(backgroundImageInput.files[0]);
    }

    document.cookie = `customText=${encodeURIComponent(customText)};path=/;max-age=31536000`; // 1年
    document.querySelector('.custom-text').innerText = customText;
    alert('設定が保存されました。');
}

function loadSettings() {
    const cookies = document.cookie.split(';');
    let backgroundImage = '';
    let customText = '';

    cookies.forEach(cookie => {
        const [name, value] = cookie.split('=');
        if (name.trim() === 'backgroundImage') {
            backgroundImage = decodeURIComponent(value);
        } else if (name.trim() === 'customText') {
            customText = decodeURIComponent(value);
        }
    });

    if (backgroundImage) {
        applyBackgroundImage(backgroundImage);
    }

    if (customText) {
        document.querySelector('.custom-text').innerText = customText;
        document.getElementById('custom-text').value = customText;
    }
}

function applyBackgroundImage(image) {
    document.querySelector('.background').style.backgroundImage = `url(${image})`;
}

function exportSettings() {
    const settings = {
        backgroundImage: getCookie('backgroundImage'),
        customText: getCookie('customText')
    };
    const settingsJson = JSON.stringify(settings);
    const blob = new Blob([settingsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'settings.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function importSettings(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const settings = JSON.parse(event.target.result);
        if (settings.backgroundImage) {
            document.cookie = `backgroundImage=${encodeURIComponent(settings.backgroundImage)};path=/;max-age=31536000`; // 1年
            applyBackgroundImage(settings.backgroundImage);
        }

        if (settings.customText) {
            document.cookie = `customText=${encodeURIComponent(settings.customText)};path=/;max-age=31536000`; // 1年
            document.querySelector('.custom-text').innerText = settings.customText;
            document.getElementById('custom-text').value = settings.customText;
        }

        alert('設定がインポートされました。');
    };

    reader.readAsText(file);
}

function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName.trim() === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return '';
}
