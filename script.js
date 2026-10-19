// QuizMaster - editable JavaScript
// You can edit the questionBank, QUESTION_COUNT, and QUIZ_SECONDS below.

const questionBank = [{
        category: "HTML",
        question: "What does HTML stand for?",
        options: ["HyperText Markup Language", "HighText Machine Language", "Hyper Transfer Markup Link", "Home Tool Markup Language"],
        correct: 0,
        explanation: "HTML stands for HyperText Markup Language and structures web pages."
    },
    {
        category: "CSS",
        question: "Which language is used to style a web page?",
        options: ["SQL", "CSS", "Python", "C++"],
        correct: 1,
        explanation: "CSS controls the appearance and layout of web pages."
    },
    {
        category: "JavaScript",
        question: "Which keyword declares a variable that can be reassigned?",
        options: ["const", "fixed", "let", "static"],
        correct: 2,
        explanation: "The let keyword declares a block-scoped variable that can be reassigned."
    },
    {
        category: "HTML",
        question: "Which HTML element creates a hyperlink?",
        options: ["<link>", "<a>", "<href>", "<url>"],
        correct: 1,
        explanation: "The anchor element <a> creates a hyperlink."
    },
    {
        category: "CSS",
        question: "Which CSS property changes text color?",
        options: ["font-style", "text-decoration", "background-color", "color"],
        correct: 3,
        explanation: "The color property sets the foreground color of text."
    },
    {
        category: "Bootstrap",
        question: "Bootstrap is mainly used for what?",
        options: ["Building responsive user interfaces", "Managing databases", "Writing operating systems", "Editing audio"],
        correct: 0,
        explanation: "Bootstrap provides ready-made styles and responsive layout utilities."
    },
    {
        category: "JavaScript",
        question: "Which symbol is commonly used for a single-line comment in JavaScript?",
        options: ["<!-- -->", "**", "//", "##"],
        correct: 2,
        explanation: "Two forward slashes // start a single-line JavaScript comment."
    },
    {
        category: "HTML",
        question: "Which attribute provides alternative text for an image?",
        options: ["title", "alt", "src", "name"],
        correct: 1,
        explanation: "The alt attribute provides a text alternative for an image."
    },
    {
        category: "CSS",
        question: "Which layout system is designed for arranging items in rows and columns?",
        options: ["Flexbox only", "Float", "CSS Grid", "Text-align"],
        correct: 2,
        explanation: "CSS Grid is a two-dimensional layout system for rows and columns."
    },
    {
        category: "JavaScript",
        question: "Which method selects an element by its ID?",
        options: ["document.getElementById()", "document.getClass()", "window.selectId()", "document.getTag()"],
        correct: 0,
        explanation: "document.getElementById() returns the element with the specified ID."
    },
    {
        category: "HTML",
        question: "Which HTML tag is used for the largest standard heading?",
        options: ["<heading>", "<h6>", "<head>", "<h1>"],
        correct: 3,
        explanation: "The h1 element is the highest-level standard HTML heading."
    },
    {
        category: "Bootstrap",
        question: "Which Bootstrap class creates a responsive fixed-width container?",
        options: [".row", ".container", ".col", ".section"],
        correct: 1,
        explanation: "The .container class creates a responsive fixed-width container."
    }
];

const QUESTION_COUNT = 5;
const QUIZ_SECONDS = 60;

const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");
const startBtn = document.getElementById("startBtn");
const quitBtn = document.getElementById("quitBtn");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const downloadBtn = document.getElementById("downloadBtn");
const themeToggle = document.getElementById("themeToggle");
const timerElement = document.getElementById("timer");
const questionCounter = document.getElementById("questionCounter");
const answeredCount = document.getElementById("answeredCount");
const progressBar = document.getElementById("progressBar");
const questionCategory = document.getElementById("questionCategory");
const questionText = document.getElementById("questionText");
const answersElement = document.getElementById("answers");
const feedbackElement = document.getElementById("feedback");
const reviewElement = document.getElementById("review");

let currentQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let secondsRemaining = QUIZ_SECONDS;
let timerInterval = null;
let quizStartedAt = null;
let quizEndedAt = null;
let quizFinished = false;

function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function startQuiz() {
    clearInterval(timerInterval);
    currentQuestions = shuffle(questionBank).slice(0, Math.min(QUESTION_COUNT, questionBank.length));
    currentQuestionIndex = 0;
    userAnswers = new Array(currentQuestions.length).fill(null);
    secondsRemaining = QUIZ_SECONDS;
    quizStartedAt = Date.now();
    quizEndedAt = null;
    quizFinished = false;

    startScreen.classList.add("hidden");
    resultScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");
    nextBtn.disabled = true;
    nextBtn.textContent = "Next question →";
    timerElement.classList.remove("warning");

    renderProgress();
    renderQuestion();
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        secondsRemaining -= 1;
        updateTimerDisplay();
        if (secondsRemaining <= 10) timerElement.classList.add("warning");
        if (secondsRemaining <= 0) finishQuiz(true);
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(Math.max(0, secondsRemaining) / 60);
    const seconds = Math.max(0, secondsRemaining) % 60;
    timerElement.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function renderProgress() {
    progressBar.innerHTML = "";
    currentQuestions.forEach((_, index) => {
        const segment = document.createElement("div");
        segment.className = "segment";
        if (index < currentQuestionIndex) segment.classList.add("done");
        if (index === currentQuestionIndex) segment.classList.add("current");
        segment.setAttribute("aria-hidden", "true");
        progressBar.appendChild(segment);
    });
    answeredCount.textContent = String(userAnswers.filter(answer => answer !== null).length);
    questionCounter.textContent = `Question ${Math.min(currentQuestionIndex + 1, currentQuestions.length)} of ${currentQuestions.length}`;
}

function renderQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    if (!question) return;

    questionCategory.textContent = question.category;
    questionText.textContent = question.question;
    answersElement.innerHTML = "";
    feedbackElement.className = "feedback hidden";
    feedbackElement.textContent = "";
    nextBtn.disabled = true;
    nextBtn.textContent = currentQuestionIndex === currentQuestions.length - 1 ? "See results →" : "Next question →";

    const letters = ["A", "B", "C", "D"];
    question.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "answer-btn";

        const letter = document.createElement("span");
        letter.className = "answer-letter";
        letter.textContent = letters[index] || String(index + 1);

        const label = document.createElement("span");
        label.textContent = option;

        button.append(letter, label);
        button.addEventListener("click", () => chooseAnswer(index));
        answersElement.appendChild(button);
    });

    renderProgress();
}

function chooseAnswer(selectedIndex) {
    if (quizFinished || userAnswers[currentQuestionIndex] !== null) return;

    const question = currentQuestions[currentQuestionIndex];
    userAnswers[currentQuestionIndex] = selectedIndex;
    const buttons = answersElement.querySelectorAll(".answer-btn");

    buttons.forEach((button, index) => {
        button.disabled = true;
        if (index === selectedIndex) {
            button.classList.add(selectedIndex === question.correct ? "correct-answer" : "wrong-answer");
        }
    });

    // Do not reveal the correct option here; reveal it on the final results page only.
    feedbackElement.textContent = selectedIndex === question.correct ?
        "Correct! Great work. Continue to the next question 🎉." :
        "Oops! Nice try. Keep going! 💪";
    feedbackElement.className = `feedback ${selectedIndex === question.correct ? "correct" : "wrong"}`;
    nextBtn.disabled = false;
    answeredCount.textContent = String(userAnswers.filter(answer => answer !== null).length);
}

function nextQuestion() {
    if (userAnswers[currentQuestionIndex] === null) return;
    if (currentQuestionIndex < currentQuestions.length - 1) {
        currentQuestionIndex += 1;
        renderQuestion();
    } else {
        finishQuiz(false);
    }
}

function finishQuiz(timeExpired = false) {
    if (quizFinished) return;
    quizFinished = true;
    clearInterval(timerInterval);
    quizEndedAt = Date.now();

    quizScreen.classList.add("hidden");
    startScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");

    const correctCount = currentQuestions.reduce((total, question, index) => {
        return total + (userAnswers[index] === question.correct ? 1 : 0);
    }, 0);
    const total = currentQuestions.length;
    const percentage = total ? Math.round((correctCount / total) * 100) : 0;
    const wrongCount = total - correctCount;
    const timeUsed = Math.min(QUIZ_SECONDS, Math.round((quizEndedAt - quizStartedAt) / 1000));
    const usedMinutes = Math.floor(timeUsed / 60);
    const usedSeconds = timeUsed % 60;

    document.getElementById("percentage").textContent = `${percentage}%`;
    document.getElementById("correctTotal").textContent = `${correctCount} / ${total}`;
    document.getElementById("wrongTotal").textContent = String(wrongCount);
    document.getElementById("timeUsed").textContent = `${String(usedMinutes).padStart(2, "0")}:${String(usedSeconds).padStart(2, "0")}`;
    document.getElementById("resultMessage").textContent = timeExpired ?
        "Time is up! Review each answer below." :
        percentage === 100 ?
        "Perfect score! Excellent work." :
        percentage >= 60 ?
        "Good effort! Review the answers below to improve further." :
        "Keep practicing! Review the correct answers and try again.";
    document.getElementById("resultTitle").textContent = "Your Quiz Results";

    const scoreCircle = document.getElementById("scoreCircle");
    scoreCircle.style.background = `conic-gradient(var(--primary) ${percentage * 3.6}deg, var(--border) 0deg)`;

    renderFinalReview();
    resultScreen.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderFinalReview() {
    reviewElement.innerHTML = "";

    currentQuestions.forEach((question, index) => {
        const selectedIndex = userAnswers[index];
        const isCorrect = selectedIndex === question.correct;
        const isUnanswered = selectedIndex === null;
        const yourAnswer = isUnanswered ? "Not answered" : question.options[selectedIndex];
        const correctAnswer = question.options[question.correct];

        const card = document.createElement("article");
        card.className = `review-card ${isCorrect ? "is-correct" : "is-wrong"}`;

        const heading = document.createElement("div");
        heading.className = "review-heading";

        const title = document.createElement("h3");
        title.textContent = `Question ${index + 1}`;

        const status = document.createElement("span");
        status.className = `result-status ${isCorrect ? "status-correct" : "status-wrong"}`;
        status.textContent = isCorrect ? "✓ Correct" : isUnanswered ? "Not answered" : "✕ Wrong";
        heading.append(title, status);

        const questionLine = document.createElement("p");
        questionLine.className = "review-question";
        questionLine.textContent = question.question;

        const yourLine = document.createElement("p");
        yourLine.className = `answer-line ${isCorrect ? "" : "your-wrong-answer"}`;
        const yourLabel = document.createElement("strong");
        yourLabel.textContent = "Your answer: ";
        yourLine.append(yourLabel, document.createTextNode(yourAnswer));

        const correctLine = document.createElement("p");
        correctLine.className = "answer-line correct-answer-text";
        const correctLabel = document.createElement("strong");
        correctLabel.textContent = "Correct answer: ";
        correctLine.append(correctLabel, document.createTextNode(correctAnswer));

        const explanation = document.createElement("p");
        explanation.className = "answer-line muted";
        explanation.textContent = `Explanation: ${question.explanation}`;

        card.append(heading, questionLine, yourLine, correctLine, explanation);
        reviewElement.appendChild(card);
    });
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    }[character]));
}

function downloadPDF() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
        alert("PDF library could not load. Please check your internet connection and try again.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const correctCount = currentQuestions.reduce((sum, question, index) => sum + (userAnswers[index] === question.correct ? 1 : 0), 0);
    const percentage = currentQuestions.length ? Math.round(correctCount / currentQuestions.length * 100) : 0;
    let y = 18;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("QuizMaster - Quiz Results", 14, y);
    y += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Score: ${correctCount} / ${currentQuestions.length} (${percentage}%)`, 14, y);
    y += 7;
    doc.text(`Date: ${new Date().toLocaleString()}`, 14, y);
    y += 10;

    currentQuestions.forEach((question, index) => {
        const selectedIndex = userAnswers[index];
        const isCorrect = selectedIndex === question.correct;
        const yourAnswer = selectedIndex === null ? "Not answered" : question.options[selectedIndex];
        const lines = [
            `Q${index + 1}. ${question.question}`,
            `Your answer: ${yourAnswer}`,
            `Correct answer: ${question.options[question.correct]}`,
            `Status: ${isCorrect ? "Correct" : selectedIndex === null ? "Not answered" : "Wrong"}`,
            `Explanation: ${question.explanation}`
        ];

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        const questionLines = doc.splitTextToSize(lines[0], 180);
        const estimatedHeight = questionLines.length * 5 + 24;
        if (y + estimatedHeight > 280) {
            doc.addPage();
            y = 18;
        }
        doc.text(questionLines, 14, y);
        y += questionLines.length * 5 + 1;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        for (let i = 1; i < lines.length; i++) {
            const wrapped = doc.splitTextToSize(lines[i], 180);
            if (y + wrapped.length * 4.5 > 282) {
                doc.addPage();
                y = 18;
            }
            doc.text(wrapped, 14, y);
            y += wrapped.length * 4.5;
        }
        y += 7;
    });

    doc.save("QuizMaster-Results.pdf");
}

function toggleTheme() {
    const isDark = document.body.classList.toggle("dark");
    themeToggle.textContent = isDark ? "☀️ Light mode" : "🌙 Dark mode";
}

startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);
quitBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to finish this quiz and see your results?")) finishQuiz(false);
});
restartBtn.addEventListener("click", startQuiz);
downloadBtn.addEventListener("click", downloadPDF);
themeToggle.addEventListener("click", toggleTheme);

// Show the starting screen when the page first opens.
startScreen.classList.remove("hidden");
quizScreen.classList.add("hidden");
resultScreen.classList.add("hidden");