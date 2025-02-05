// 通知回数に応じて通知時間の選択肢を追加
function updateCount() {
    const noticeCount = document.getElementById("noticeCount").value;  // 選択された通知回数
    const container = document.getElementById("itemsContainer");  // アイテムを表示するコンテナ

    // 既存の内容をクリア
    container.innerHTML = '';

    // 通知回数分、通知時間を入力できるフォームを追加
    for (let i = 0; i < noticeCount; i++) {
        const label = document.createElement("label");
        label.textContent = `${i + 1} 回目の通知時間を選択してください`;

        // 通知時間を選択するセレクトボックスをラップする div
        const selectWrapper = document.createElement('div');
        selectWrapper.classList.add('custom-select-wrapper');  // セレクトボックスをラップする要素

        const select = document.createElement("select");
        select.name = `notificationTime${i + 1}`;
        select.classList.add('custom-select');  // カスタムセレクトに適用するクラスを追加

        // 1時間ごとおよび30分ごとの時間を選択肢として追加
        for (let hour = 0; hour < 24; hour++) {
            const hourString = hour.toString().padStart(2, "0");

            // 1時間ごとの時間（00分）
            const option1 = document.createElement("option");
            option1.value = `${hourString}:00`;  // 時間の00分
            option1.textContent = `${hourString}:00`;
            select.appendChild(option1);

            // 30分ごとの時間（30分）
            const option2 = document.createElement("option");
            option2.value = `${hourString}:30`; // 時間の30分
            option2.textContent = `${hourString}:30`;
            select.appendChild(option2);
        }

        // セレクトボックスをラッパーに追加
        selectWrapper.appendChild(select);

        // コンテナに追加
        container.appendChild(label);
        container.appendChild(selectWrapper);
        container.appendChild(document.createElement("br")); // 改行
    }
}

// ページが読み込まれた時に実行
document.addEventListener("DOMContentLoaded", function () {
    updateCount();  // 初期表示
});

document.getElementById("selectUsers").addEventListener("change", function() {
    document.getElementById("noticeCount").value = 1; // 通知回数を初期値に戻す
    updateCount(); // 画面を更新
});
