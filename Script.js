// ساعت و تاریخ
const updateDateTime = () => {
    const now = new Date();
    document.getElementById("time").textContent = now.toLocaleTimeString("fa-IR");
    document.getElementById("date").textContent = now.toLocaleDateString("fa-IR");
};
setInterval(updateDateTime, 1000);

// شروع برنامه
document.getElementById("startButton").addEventListener("click", () => {
    document.getElementById("welcomeMessage").style.display = "none";
    document.getElementById("mainApp").style.display = "block";
});

// ذخیره و مدیریت نظرات
const comments = JSON.parse(localStorage.getItem("comments")) || []; // بازیابی نظرات ذخیره‌شده یا تنظیم آرایه خالی
const userHasCommented = localStorage.getItem("userCommented"); // بررسی اینکه آیا کاربر قبلاً نظر داده است

// نمایش نظرات ذخیره‌شده در شروع برنامه
window.onload = () => {
    displayComments();
};

// ثبت نظر جدید
document.getElementById("submitComment").addEventListener("click", () => {
    if (userHasCommented) {
        alert("شما قبلاً نظر خود را ثبت کرده‌اید!");
        return;
    }

    const commentInput = document.getElementById("comment");
    const comment = commentInput.value.trim();

    if (comment.length > 0 && comment.length <= 50) {
        comments.push(comment); // اضافه کردن نظر به آرایه
        localStorage.setItem("comments", JSON.stringify(comments)); // ذخیره نظرات در LocalStorage
        localStorage.setItem("userCommented", true); // ذخیره محدودیت ثبت نظر برای کاربر
        alert("نظر شما با موفقیت ثبت شد.");
        commentInput.value = ""; // پاک‌سازی فیلد نظر
        displayComments(); // به‌روزرسانی لیست نظرات
    } else if (comment.length > 50) {
        alert("نظر شما نباید بیش از 50 کاراکتر باشد.");
    } else {
        alert("لطفاً متنی وارد کنید.");
    }
});

// نمایش نظرات
document.getElementById("viewComments").addEventListener("click", displayComments);

function displayComments() {
    const commentsList = document.getElementById("commentsList");
    commentsList.innerHTML = ""; // پاک کردن لیست قبلی
    comments.forEach((comment, index) => {
        const commentItem = document.createElement("p");
        commentItem.textContent = `${index + 1}. ${comment}`; // نمایش شماره ترتیب و متن نظر
        commentsList.appendChild(commentItem);
    });
}

// مدیریت رأی‌دهی
let hasVoted = false; // برای پیگیری اینکه آیا کاربر رأی داده است یا نه
let voteType = null;

let agreeCount = 0, neutralCount = 0, disagreeCount = 0;

document.getElementById("yesButton").addEventListener("click", () => handleVote("agree"));
document.getElementById("neutralButton").addEventListener("click", () => handleVote("neutral"));
document.getElementById("noButton").addEventListener("click", () => handleVote("disagree"));

function handleVote(type) {
    if (!hasVoted) {
        hasVoted = true;
        voteType = type;
        incrementVote(type);
        alert("رأی شما ثبت شد!");
    } else if (voteType !== type) {
        decrementVote(voteType);
        incrementVote(type);
        voteType = type;
        alert("رأی شما تغییر کرد!");
    }
}

function incrementVote(type) {
    if (type === "agree") agreeCount++;
    else if (type === "neutral") neutralCount++;
    else if (type === "disagree") disagreeCount++;
    updateStats();
}

function decrementVote(type) {
    if (type === "agree") agreeCount--;
    else if (type === "neutral") neutralCount--;
    else if (type === "disagree") disagreeCount--;
    updateStats();
}

// به‌روزرسانی آمار و نمودار
function updateStats() {
    document.getElementById("agreeCount").textContent = agreeCount;
    document.getElementById("neutralCount").textContent = neutralCount;
    document.getElementById("disagreeCount").textContent = disagreeCount;
    updateChart();
}

// نمودار رأی‌گیری
const ctx = document.getElementById('voteChart').getContext('2d');
const voteChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['آری', 'ممتنع', 'نه'],
        datasets: [{
            data: [agreeCount, neutralCount, disagreeCount],
            backgroundColor: ['green', 'white', 'red'],
        }]
    },
    options: {
        responsive: true
    }
});

function updateChart() {
    voteChart.data.datasets[0].data = [agreeCount, neutralCount, disagreeCount];
    voteChart.update();
}

// اشتراک‌گذاری برنامه
document.getElementById("shareButton").addEventListener("click", () => {
    if (navigator.share) {
        navigator.share({
            title: "برنامه نظر سنجی",
            text: "برنامه نظر سنجی: آیا با عملکرد و ادامه کار و حیات نظام موافقید؟",
            url: window.location.href,
        })
        .then(() => alert("برنامه با موفقیت به اشتراک گذاشته شد."))
        .catch((error) => console.error("خطا در اشتراک‌گذاری:", error));
    } else {
        alert("مرورگر شما از قابلیت اشتراک‌گذاری پشتیبانی نمی‌کند.");
    }
});