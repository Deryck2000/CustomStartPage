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

    reader.onload = function (event) {
        const backgroundImage = event.target.result;
        document.cookie = `backgroundImage=${encodeURIComponent(backgroundImage)};path=/;max-age=31536000`; // 1年
        applyBackgroundImage(backgroundImage);
    };

    if (backgroundImageInput.files[0]) {
        reader.readAsDataURL(backgroundImageInput.files[0]);
    }

    document.cookie = `customText=${encodeURIComponent(customText)};path=/;max-age=31536000`; // 1年
    document.querySelector('.custom-text').innerText = customText;
    alert('設定が保存されました。');
}

function loadSettings() {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    let backgroundImage = '';
    let customText = '';

    cookies.forEach(cookie => {
        const [name, value] = cookie.split('=');
        if (name === 'backgroundImage') {
            backgroundImage = decodeURIComponent(value);
            console.log(`背景画像の設定を読み込みました: ${backgroundImage}`);
        } else if (name === 'customText') {
            customText = decodeURIComponent(value);
            console.log(`カスタムテキストの設定を読み込みました: ${customText}`);
        }
    });

    if (backgroundImage) {
        applyBackgroundImage(backgroundImage);
    } else {
        console.error('背景画像が読み込めませんでした');
    }

    if (customText) {
        document.querySelector('.custom-text').innerText = customText;
        document.getElementById('custom-text').value = customText;
    } else {
        console.error('カスタムテキストが読み込めませんでした');
    }
}

function applyBackgroundImage(image) {
    const backgroundElement = document.querySelector('.background');
    if (backgroundElement) {
        backgroundElement.style.backgroundImage = `url(${image})`;
        console.log(`背景画像を適用しました: ${image}`);
    } else {
        console.error('背景要素が見つかりませんでした');
    }
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
