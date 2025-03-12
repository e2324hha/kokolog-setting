// Firebaseの初期化
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

// Firebase設定
const firebaseConfig = {
  apiKey: "AIzaSyCoXF58jAyI5WURShsP7EPvBdMbjk7Moeg",
  authDomain: "sample-f469e.firebaseapp.com",
  projectId: "sample-f469e",
  storageBucket: "sample-f469e.firebasestorage.app",
  messagingSenderId: "26366997464",
  appId: "1:26366997464:web:cd58cf4ea23351556978ad",
  measurementId: "G-DQMXN8JR59"
};

// Firebaseを初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// LIFFの初期化
liff.init({ liffId: "2006651137-3dREG9Z9" })
    .then(async () => {
        if (!liff.isLoggedIn()) {
            liff.login();
        } else {
            const profile = await liff.getProfile();
            const userId = profile.userId; // ユーザーIDを取得
            console.log("取得したLINE ID:", userId);
            loadChildUsers(userId);
        }
    })
    .catch(err => {
        console.error('LIFFの初期化エラー:', err);
    });

// Firestoreから`childrens`フィールドを取得しセレクトボックスに追加
async function loadChildUsers(userId) {
    try {
        const userRef = doc(db, "kokologParents", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            const childrens = userData.childrens || [];

            console.log("取得した childrens:", childrens);
            populateSelectBox(childrens);
        } else {
            console.log("該当するユーザーが見つかりません");
        }
    } catch (error) {
        console.error("Firestore取得エラー:", error);
    }
}

// `childrens` をセレクトボックス `selectUsers` に追加
function populateSelectBox(childrens) {
    const select = document.getElementById("selectUsers");
    select.innerHTML = ""; // 既存データをクリア

    if (childrens.length === 0) {
        const option = document.createElement("option");
        option.textContent = "登録されている子供はいません";
        option.disabled = true;
        select.appendChild(option);
        return;
    }

    childrens.forEach(childId => {
        const option = document.createElement("option");
        option.value = childId;
        option.textContent = `Child ID: ${childId}`;
        select.appendChild(option);
    });
}

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

// `noticeCount` の変更時に `itemsContainer` を更新
document.getElementById("noticeCount").addEventListener("change", updateCount);

// `selectUsers` の選択変更時に `noticeCount` をリセット
document.getElementById("selectUsers").addEventListener("change", function() {
    document.getElementById("noticeCount").value = 1; // 通知回数を初期値に戻す
    updateCount(); // 画面を更新
});

// `saveBtn` を押すとFirestoreにデータを保存
document.getElementById("saveBtn").addEventListener("click", async () => {
    const userId = liff.getProfile().then(profile => profile.userId);
    const selectedChildId = document.getElementById("selectUsers").value;
    const inputElements = document.querySelectorAll(".custom-select");
    let notificationTimes = [];

    inputElements.forEach(input => {
        notificationTimes.push(input.value);
    });

    if (!selectedChildId) {
        alert("子供を選択してください！");
        return;
    }

    try {
        const userRef = doc(db, "kokologParents", userId);
        await updateDoc(userRef, {
            [`notificationTimes.${selectedChildId}`]: notificationTimes
        });

        alert("通知時間を保存しました！");
    } catch (error) {
        console.error("Firestore保存エラー:", error);
        alert("保存に失敗しました。");
    }
});
