
const list = document.getElementById("diagram-list");
const search = document.getElementById("search");
const count = document.getElementById("count");
const buttons = document.querySelectorAll(".category button");

let diagrams = [];
let currentType = "all";

// JSON読み込み
async function loadDiagrams() {
    try {
        const response = await fetch("data/diagrams.json");

        if (!response.ok) {
            throw new Error("JSONの読み込みに失敗しました");
        }

        diagrams = await response.json();
        renderDiagrams();

    } catch (error) {
        list.innerHTML =
            "<p>データを読み込めませんでした。サーバー環境を確認してください。</p>";

        count.textContent = "ERROR";
        console.error(error);
    }
}

// ダイヤグラム一覧表示
function renderDiagrams() {
    const keyword = search.value.toLowerCase();

    const filtered = diagrams.filter(item => {
        const matchesType =
            currentType === "all" || item.type === currentType;

        const text = [
            item.operator,
            item.line,
            item.section,
            item.day_type
        ].join(" ").toLowerCase();

        return matchesType && text.includes(keyword);
    });

    count.textContent = `${filtered.length} RECORDS`;

    if (filtered.length === 0) {
        list.innerHTML = "<p>該当するデータがありません。</p>";
        return;
    }

    list.innerHTML = filtered.map(item => `
        <article class="diagram-card">
            <div class="diagram-type">
                ${item.type === "railway" ? "RAILWAY" : "BUS"}
                / ${item.id}
            </div>

            <h3>${escapeHTML(item.line)}</h3>

            <p>
                事業者：${escapeHTML(item.operator)}<br>
                区間：${escapeHTML(item.section)}<br>
                ダイヤ：${escapeHTML(item.day_type)}
            </p>

            <a href="detail.html?id=${encodeURIComponent(item.id)}">
                VIEW DETAILS →
            </a>
        </article>
    `).join("");
}

// HTMLとして解釈されないようにする
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// 検索
search.addEventListener("input", renderDiagrams);

// カテゴリ切り替え
buttons.forEach(button => {
    button.addEventListener("click", () => {
        currentType = button.dataset.type;

        buttons.forEach(btn =>
            btn.classList.remove("selected")
        );

        button.classList.add("selected");
        renderDiagrams();
    });
});

// 起動
loadDiagrams();
