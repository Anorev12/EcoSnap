import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./settings.css";

// ─── Language translations ────────────────────────────────────────

const TRANSLATIONS = {
  en: {
    profileTitle: "Profile",
    profileSubtitle: "Manage your personal information",
    firstName: "First name",
    lastName: "Last name",
    bio: "Bio",
    username: "Username",
    email: "Email",
    changePhoto: "Change photo",
    editProfile: "Edit Profile",
    saveChanges: "Save changes",
    cancel: "Cancel",
    profileUpdated: "Profile updated successfully!",
    usernameChangeLimit: "Username can only be changed once per month. Next allowed:",
    canChangeUsername: "You can change your username once per month.",
    emailChangeNote: "To change your email, go to Account & Security and submit a request to the admin.",
    
    securityTitle: "Account & Security",
    securitySubtitle: "Manage your account security and preferences",
    emailAddress: "Email Address",
    currentEmail: "Current email",
    newEmailAddress: "New email address",
    emailChangeNote2: "Email changes require admin approval. Your current email stays active until approved.",
    requestEmailChange: "Request email change",
    emailPending: "Pending request: You requested to change your email to",
    waitingApproval: "Waiting for admin approval.",
    password: "Password",
    newPassword: "New password",
    confirmPassword: "Confirm new password",
    updatePassword: "Update password",
    deleteAccount: "Delete account",
    dangerZone: "Danger zone",
    deleteAccountConfirm: "Permanently remove your account and all data",
    
    appearance: "Appearance",
    appearanceSubtitle: "Customize how EcoSnap looks",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
    textSize: "Text size",
    fontSize: "Font size",
    small: "Small",
    medium: "Medium",
    large: "Large",
    accentColor: "Accent color",
    
    language: "Language",
    region: "Region",
    timeZone: "Time zone",
    dateFormat: "Date format",
    languageRegionTitle: "Language & Region",
    languageRegionSubtitle: "Set your language and location preferences",
    savePreferences: "Save preferences",
    preferencesSaved: "Preferences saved successfully!",
    
    notifications: "Notifications",
    notificationsSubtitle: "Control how you receive updates",
    pushNotifications: "Push notifications",
    scanReminders: "Scan reminders",
    dailyNudge: "Daily nudge to scan items",
    ecoTips: "Eco tips",
    weeklySustainability: "Weekly sustainability tips",
    communityUpdates: "Community updates",
    newPosts: "New posts from people you follow",
    emailNotifications: "Email notifications",
    newsletter: "Newsletter",
    monthlyDigest: "Monthly EcoSnap digest",
    productAnnouncements: "Product announcements",
    newFeatures: "New features and updates",
    
    privacy: "Privacy & Data",
    privacySubtitle: "Control your data and privacy settings",
    dataSharing: "Data sharing",
    analytics: "Analytics",
    helpImprove: "Help improve EcoSnap with usage data",
    personalizedSuggestions: "Personalized suggestions",
    useScanHistory: "Use scan history for recommendations",
    locationData: "Location data",
    usedForRecycling: "Used for nearby recycling centers",
    yourData: "Your data",
    exportData: "Export my data",
    downloadCopy: "Download a copy of your EcoSnap data",
    export: "Export",
    
    storage: "Storage & Usage",
    storageSubtitle: "Manage your storage space",
    storageUsed: "Storage used",
    scanHistory: "Scan history",
    cachedImages: "Cached images",
    clearData: "Clear data",
    clearCached: "Clear cached images",
    freesUp: "Frees up",
    clearScanHistory: "Clear scan history",
    cannotUndo: "Cannot be undone",
    clear: "Clear",
    
    sessions: "Active Sessions",
    sessionsSubtitle: "Manage your logged-in devices",
    loggedInDevices: "Logged-in devices",
    current: "Current",
    revoke: "Revoke",
    revokeAll: "Revoke all other sessions",
    
    feedback: "Feedback",
    feedbackSubtitle: "Help us improve EcoSnap",
    overallExperience: "Overall experience",
    aboutFeedback: "What is your feedback about?",
    tellMore: "Tell us more (optional)",
    sharethoughts: "Share your thoughts, suggestions, or report an issue…",
    submitFeedback: "Submit feedback",
    general: "General",
    uiDesign: "UI / Design",
    performance: "Performance",
    scanAccuracy: "Scan Accuracy",
    tipsFacts: "Tips & Facts",
    bugReport: "Bug Report",
    featureRequest: "Feature Request",
    other: "Other",
    poor: "Poor",
    fair: "Fair",
    good: "Good",
    veryGood: "Very Good",
    excellent: "Excellent",
    tapStar: "Tap a star to rate",
    thankYou: "Thank you! Your feedback has been submitted.",
    
    account: "Account",
    preferences: "Preferences",
    app: "App",
    support: "Support",
    aboutEcoSnap: "About EcoSnap",
    logout: "Log Out",
    
    submitting: "Submitting…",
    updating: "Updating…",
    deleting: "Deleting…",
    saving: "Saving…",
    empty: "Please enter a value.",
    alreadyEmail: "That's already your current email.",
    passwordsNotMatch: "Passwords do not match.",
    passwordLength: "Password must be at least 6 characters.",
    selectRating: "Please select a star rating.",
    failedSubmit: "Failed to submit request.",
    failedSave: "Failed to save profile.",
    failedUpdate: "Failed to update password.",
    failedDelete: "Failed to delete account.",
  },
  fil: {
    profileTitle: "Profil",
    profileSubtitle: "Pamahalaan ang iyong personal na impormasyon",
    firstName: "Unang pangalan",
    lastName: "Apelyido",
    bio: "Buhay",
    username: "Username",
    email: "Email",
    changePhoto: "Baguhin ang larawan",
    editProfile: "I-edit ang Profil",
    saveChanges: "Savin ang mga pagbabago",
    cancel: "Kanselahin",
    profileUpdated: "Matagumpay na na-update ang profil!",
    usernameChangeLimit: "Ang username ay maaaring baguhin lamang minsan bawat buwan. Susunod na pinapayagan:",
    canChangeUsername: "Maaari mong baguhin ang iyong username minsan bawat buwan.",
    emailChangeNote: "Upang baguhin ang iyong email, pumunta sa Account & Security at magsumite ng kahilingan sa admin.",
    
    securityTitle: "Account & Seguridad",
    securitySubtitle: "Pamahalaan ang iyong account security at preferences",
    emailAddress: "Email Address",
    currentEmail: "Kasalukuyang email",
    newEmailAddress: "Bagong email address",
    emailChangeNote2: "Ang mga pagbabago sa email ay nangangailangan ng aproval ng admin. Ang iyong kasalukuyang email ay manatiling aktibo hanggang sa maaprubahan.",
    requestEmailChange: "Humiling ng pagbabago ng email",
    emailPending: "Naghihintay na kahilingan: Humiling ka na na baguhin ang iyong email sa",
    waitingApproval: "Naghihintay ng aproval ng admin.",
    password: "Password",
    newPassword: "Bagong password",
    confirmPassword: "Kumpirmahin ang bagong password",
    updatePassword: "I-update ang password",
    deleteAccount: "Tanggalin ang account",
    dangerZone: "Danger zone",
    deleteAccountConfirm: "Permanenteng alisin ang iyong account at lahat ng data",
    
    appearance: "Hitsura",
    appearanceSubtitle: "I-customize kung paano mukhang EcoSnap",
    theme: "Tema",
    light: "Maliwanag",
    dark: "Madilim",
    system: "Sistema",
    textSize: "Laki ng teksto",
    fontSize: "Laki ng font",
    small: "Maliit",
    medium: "Katamtaman",
    large: "Malaki",
    accentColor: "Accent color",
    
    language: "Wika",
    region: "Rehiyon",
    timeZone: "Time zone",
    dateFormat: "Format ng petsa",
    languageRegionTitle: "Wika & Rehiyon",
    languageRegionSubtitle: "Itakda ang iyong wika at preferences sa lokasyon",
    savePreferences: "Savin ang preferences",
    preferencesSaved: "Matagumpay na nakatipid ang mga preference!",
    
    notifications: "Mga Notipikasyon",
    notificationsSubtitle: "Kontrolin kung paano ka makakatanggap ng updates",
    pushNotifications: "Push notifications",
    scanReminders: "Scan reminders",
    dailyNudge: "Araw-araw na paalala na mag-scan ng mga item",
    ecoTips: "Eco tips",
    weeklySustainability: "Linggong sustainability tips",
    communityUpdates: "Community updates",
    newPosts: "Mga bagong post mula sa mga taong sinusundan mo",
    emailNotifications: "Email notifications",
    newsletter: "Newsletter",
    monthlyDigest: "Monthly EcoSnap digest",
    productAnnouncements: "Product announcements",
    newFeatures: "Mga bagong feature at updates",
    
    privacy: "Privacy & Data",
    privacySubtitle: "Kontrolin ang iyong data at privacy settings",
    dataSharing: "Data sharing",
    analytics: "Analytics",
    helpImprove: "Tumulong sa pagpapabuti ng EcoSnap gamit ang usage data",
    personalizedSuggestions: "Personalized suggestions",
    useScanHistory: "Gamitin ang scan history para sa mga rekomendasyon",
    locationData: "Location data",
    usedForRecycling: "Ginagamit para sa malapit na recycling centers",
    yourData: "Ang iyong data",
    exportData: "I-export ang aking data",
    downloadCopy: "I-download ang kopya ng iyong EcoSnap data",
    export: "I-export",
    
    storage: "Storage & Usage",
    storageSubtitle: "Pamahalaan ang iyong storage space",
    storageUsed: "Ginamit na storage",
    scanHistory: "Scan history",
    cachedImages: "Cached images",
    clearData: "I-clear ang data",
    clearCached: "I-clear ang cached images",
    freesUp: "Nagpapabago ng",
    clearScanHistory: "I-clear ang scan history",
    cannotUndo: "Hindi maaaring i-undo",
    clear: "I-clear",
    
    sessions: "Active Sessions",
    sessionsSubtitle: "Pamahalaan ang iyong mga naka-login na devices",
    loggedInDevices: "Mga naka-login na devices",
    current: "Kasalukuyan",
    revoke: "I-revoke",
    revokeAll: "I-revoke ang lahat ng ibang sessions",
    
    feedback: "Feedback",
    feedbackSubtitle: "Tumulong sa pagpapabuti ng EcoSnap",
    overallExperience: "Kabuuang karanasan",
    aboutFeedback: "Tungkol saan ang iyong feedback?",
    tellMore: "Ikuwento ang higit pa (opsyonal)",
    sharethoughts: "Ibahagi ang iyong mga pananaw, mungkahi, o ulat ng isyu…",
    submitFeedback: "Ipadala ang feedback",
    general: "Pangkalahatan",
    uiDesign: "UI / Design",
    performance: "Performance",
    scanAccuracy: "Scan Accuracy",
    tipsFacts: "Tips & Facts",
    bugReport: "Bug Report",
    featureRequest: "Feature Request",
    other: "Iba",
    poor: "Mahinang",
    fair: "Katamtaman",
    good: "Mabuti",
    veryGood: "Napakabuti",
    excellent: "Napakahusay",
    tapStar: "Pindutin ang bituin upang i-rate",
    thankYou: "Salamat! Ang iyong feedback ay isinumite na.",
    
    account: "Account",
    preferences: "Preferences",
    app: "App",
    support: "Support",
    aboutEcoSnap: "Tungkol sa EcoSnap",
    logout: "Mag-logout",
    
    submitting: "Nagpapadala…",
    updating: "Nag-a-update…",
    deleting: "Nag-delete…",
    saving: "Nagsasave…",
    empty: "Mangyaring magpasok ng halaga.",
    alreadyEmail: "Iyan na ang iyong kasalukuyang email.",
    passwordsNotMatch: "Ang mga password ay hindi tumutugma.",
    passwordLength: "Ang password ay dapat na hindi bababa sa 6 na character.",
    selectRating: "Mangyaring pumili ng star rating.",
    failedSubmit: "Nabigo ang pagsumite ng kahilingan.",
    failedSave: "Nabigo ang pag-save ng profile.",
    failedUpdate: "Nabigo ang pag-update ng password.",
    failedDelete: "Nabigo ang pagtanggal ng account.",
  },
  es: {
    profileTitle: "Perfil",
    profileSubtitle: "Administra tu información personal",
    firstName: "Nombre de pila",
    lastName: "Apellido",
    bio: "Biografía",
    username: "Nombre de usuario",
    email: "Correo electrónico",
    changePhoto: "Cambiar foto",
    editProfile: "Editar perfil",
    saveChanges: "Guardar cambios",
    cancel: "Cancelar",
    profileUpdated: "¡Perfil actualizado correctamente!",
    usernameChangeLimit: "El nombre de usuario solo puede cambiarse una vez al mes. Próximo permitido:",
    canChangeUsername: "Puede cambiar su nombre de usuario una vez al mes.",
    emailChangeNote: "Para cambiar su correo, vaya a Cuenta y Seguridad e envíe una solicitud al administrador.",
    
    securityTitle: "Cuenta y Seguridad",
    securitySubtitle: "Administra tu seguridad de cuenta y preferencias",
    emailAddress: "Dirección de correo electrónico",
    currentEmail: "Correo electrónico actual",
    newEmailAddress: "Nueva dirección de correo",
    emailChangeNote2: "Los cambios de correo requieren aprobación del administrador. Su correo actual permanece activo hasta ser aprobado.",
    requestEmailChange: "Solicitar cambio de correo",
    emailPending: "Solicitud pendiente: Solicitó cambiar su correo a",
    waitingApproval: "Esperando aprobación del administrador.",
    password: "Contraseña",
    newPassword: "Nueva contraseña",
    confirmPassword: "Confirmar nueva contraseña",
    updatePassword: "Actualizar contraseña",
    deleteAccount: "Eliminar cuenta",
    dangerZone: "Zona de peligro",
    deleteAccountConfirm: "Eliminar permanentemente tu cuenta y todos tus datos",
    
    appearance: "Apariencia",
    appearanceSubtitle: "Personaliza cómo se ve EcoSnap",
    theme: "Tema",
    light: "Claro",
    dark: "Oscuro",
    system: "Sistema",
    textSize: "Tamaño de texto",
    fontSize: "Tamaño de fuente",
    small: "Pequeño",
    medium: "Mediano",
    large: "Grande",
    accentColor: "Color de acento",
    
    language: "Idioma",
    region: "Región",
    timeZone: "Zona horaria",
    dateFormat: "Formato de fecha",
    languageRegionTitle: "Idioma y Región",
    languageRegionSubtitle: "Establece tus preferencias de idioma y ubicación",
    savePreferences: "Guardar preferencias",
    preferencesSaved: "¡Preferencias guardadas correctamente!",
    
    notifications: "Notificaciones",
    notificationsSubtitle: "Controla cómo recibes actualizaciones",
    pushNotifications: "Notificaciones push",
    scanReminders: "Recordatorios de escaneo",
    dailyNudge: "Recordatorio diario para escanear elementos",
    ecoTips: "Consejos ecológicos",
    weeklySustainability: "Consejos de sostenibilidad semanales",
    communityUpdates: "Actualizaciones comunitarias",
    newPosts: "Nuevas publicaciones de personas que sigues",
    emailNotifications: "Notificaciones por correo",
    newsletter: "Boletín",
    monthlyDigest: "Resumen mensual de EcoSnap",
    productAnnouncements: "Anuncios de productos",
    newFeatures: "Nuevas funciones y actualizaciones",
    
    privacy: "Privacidad y Datos",
    privacySubtitle: "Controla tu configuración de datos y privacidad",
    dataSharing: "Compartir datos",
    analytics: "Análisis",
    helpImprove: "Ayuda a mejorar EcoSnap con datos de uso",
    personalizedSuggestions: "Sugerencias personalizadas",
    useScanHistory: "Usar historial de escaneo para recomendaciones",
    locationData: "Datos de ubicación",
    usedForRecycling: "Se utiliza para centros de reciclaje cercanos",
    yourData: "Tus datos",
    exportData: "Exportar mis datos",
    downloadCopy: "Descarga una copia de tus datos de EcoSnap",
    export: "Exportar",
    
    storage: "Almacenamiento y Uso",
    storageSubtitle: "Administra tu espacio de almacenamiento",
    storageUsed: "Almacenamiento utilizado",
    scanHistory: "Historial de escaneo",
    cachedImages: "Imágenes en caché",
    clearData: "Borrar datos",
    clearCached: "Borrar imágenes en caché",
    freesUp: "Libera",
    clearScanHistory: "Borrar historial de escaneo",
    cannotUndo: "No se puede deshacer",
    clear: "Borrar",
    
    sessions: "Sesiones Activas",
    sessionsSubtitle: "Administra tus dispositivos conectados",
    loggedInDevices: "Dispositivos conectados",
    current: "Actual",
    revoke: "Revocar",
    revokeAll: "Revocar todas las otras sesiones",
    
    feedback: "Comentarios",
    feedbackSubtitle: "Ayuda a mejorar EcoSnap",
    overallExperience: "Experiencia general",
    aboutFeedback: "¿Sobre qué trata tu comentario?",
    tellMore: "Cuéntanos más (opcional)",
    sharethoughts: "Comparte tus opiniones, sugerencias o reporta un problema…",
    submitFeedback: "Enviar comentario",
    general: "General",
    uiDesign: "UI / Diseño",
    performance: "Rendimiento",
    scanAccuracy: "Precisión de escaneo",
    tipsFacts: "Consejos y datos",
    bugReport: "Reporte de errores",
    featureRequest: "Solicitud de función",
    other: "Otro",
    poor: "Pobre",
    fair: "Regular",
    good: "Bueno",
    veryGood: "Muy bueno",
    excellent: "Excelente",
    tapStar: "Toca una estrella para calificar",
    thankYou: "¡Gracias! Tu comentario ha sido enviado.",
    
    account: "Cuenta",
    preferences: "Preferencias",
    app: "Aplicación",
    support: "Soporte",
    aboutEcoSnap: "Acerca de EcoSnap",
    logout: "Cerrar sesión",
    
    submitting: "Enviando…",
    updating: "Actualizando…",
    deleting: "Eliminando…",
    saving: "Guardando…",
    empty: "Por favor ingresa un valor.",
    alreadyEmail: "Ese es ya tu correo actual.",
    passwordsNotMatch: "Las contraseñas no coinciden.",
    passwordLength: "La contraseña debe tener al menos 6 caracteres.",
    selectRating: "Por favor selecciona una calificación de estrellas.",
    failedSubmit: "Falló al enviar la solicitud.",
    failedSave: "Falló al guardar el perfil.",
    failedUpdate: "Falló al actualizar la contraseña.",
    failedDelete: "Falló al eliminar la cuenta.",
  },
  ja: {
    profileTitle: "プロフィール",
    profileSubtitle: "個人情報を管理する",
    firstName: "名",
    lastName: "姓",
    bio: "バイオ",
    username: "ユーザー名",
    email: "メール",
    changePhoto: "写真を変更",
    editProfile: "プロフィールを編集",
    saveChanges: "変更を保存",
    cancel: "キャンセル",
    profileUpdated: "プロフィールが正常に更新されました!",
    usernameChangeLimit: "ユーザー名は月に1回のみ変更できます。次に許可される日:",
    canChangeUsername: "ユーザー名は月に1回変更できます。",
    emailChangeNote: "メールアドレスを変更するには、アカウントとセキュリティに移動して管理者にリクエストを送信してください。",
    
    securityTitle: "アカウントとセキュリティ",
    securitySubtitle: "アカウントのセキュリティ設定を管理する",
    emailAddress: "メールアドレス",
    currentEmail: "現在のメール",
    newEmailAddress: "新しいメールアドレス",
    emailChangeNote2: "メールアドレスの変更には管理者の承認が必要です。承認されるまで現在のメールがアクティブのままです。",
    requestEmailChange: "メール変更をリクエスト",
    emailPending: "保留中のリクエスト: メール変更をリクエストしました",
    waitingApproval: "管理者の承認を待機中。",
    password: "パスワード",
    newPassword: "新しいパスワード",
    confirmPassword: "新しいパスワードを確認",
    updatePassword: "パスワードを更新",
    deleteAccount: "アカウントを削除",
    dangerZone: "危険ゾーン",
    deleteAccountConfirm: "アカウントと全データを永久に削除",
    
    appearance: "外観",
    appearanceSubtitle: "EcoSnapの見た目をカスタマイズする",
    theme: "テーマ",
    light: "ライト",
    dark: "ダーク",
    system: "システム",
    textSize: "テキストサイズ",
    fontSize: "フォントサイズ",
    small: "小",
    medium: "中",
    large: "大",
    accentColor: "アクセントカラー",
    
    language: "言語",
    region: "地域",
    timeZone: "タイムゾーン",
    dateFormat: "日付形式",
    languageRegionTitle: "言語と地域",
    languageRegionSubtitle: "言語と位置情報の設定を行う",
    savePreferences: "設定を保存",
    preferencesSaved: "設定が正常に保存されました!",
    
    notifications: "通知",
    notificationsSubtitle: "更新の受け取り方を管理する",
    pushNotifications: "プッシュ通知",
    scanReminders: "スキャンリマインダー",
    dailyNudge: "毎日アイテムをスキャンするリマインダー",
    ecoTips: "エコティップス",
    weeklySustainability: "週刊サステナビリティのヒント",
    communityUpdates: "コミュニティ更新",
    newPosts: "フォローしている人からの新しい投稿",
    emailNotifications: "メール通知",
    newsletter: "ニュースレター",
    monthlyDigest: "月刊EcoSnap要約",
    productAnnouncements: "製品の発表",
    newFeatures: "新機能とアップデート",
    
    privacy: "プライバシーとデータ",
    privacySubtitle: "データとプライバシー設定を制御する",
    dataSharing: "データ共有",
    analytics: "分析",
    helpImprove: "使用状況データを使用してEcoSnapの改善を支援",
    personalizedSuggestions: "パーソナライズされた提案",
    useScanHistory: "スキャン履歴を推奨事項に使用",
    locationData: "位置情報",
    usedForRecycling: "近くのリサイクルセンターに使用",
    yourData: "あなたのデータ",
    exportData: "データをエクスポート",
    downloadCopy: "EcoSnapデータのコピーをダウンロード",
    export: "エクスポート",
    
    storage: "ストレージと使用状況",
    storageSubtitle: "ストレージスペースを管理する",
    storageUsed: "使用ストレージ",
    scanHistory: "スキャン履歴",
    cachedImages: "キャッシュ画像",
    clearData: "データをクリア",
    clearCached: "キャッシュ画像をクリア",
    freesUp: "解放",
    clearScanHistory: "スキャン履歴をクリア",
    cannotUndo: "元に戻せません",
    clear: "クリア",
    
    sessions: "アクティブセッション",
    sessionsSubtitle: "ログインしているデバイスを管理する",
    loggedInDevices: "ログインしているデバイス",
    current: "現在",
    revoke: "取り消す",
    revokeAll: "他のすべてのセッションを取り消す",
    
    feedback: "フィードバック",
    feedbackSubtitle: "EcoSnapの改善を支援する",
    overallExperience: "全体的な体験",
    aboutFeedback: "フィードバックは何についてですか?",
    tellMore: "もっと教えてください(オプション)",
    sharethoughts: "ご感想、ご提案、問題報告を共有…",
    submitFeedback: "フィードバックを送信",
    general: "一般",
    uiDesign: "UI / デザイン",
    performance: "パフォーマンス",
    scanAccuracy: "スキャン精度",
    tipsFacts: "ヒントと事実",
    bugReport: "バグ報告",
    featureRequest: "機能リクエスト",
    other: "その他",
    poor: "悪い",
    fair: "普通",
    good: "良い",
    veryGood: "非常に良い",
    excellent: "優秀",
    tapStar: "評価する星をタップ",
    thankYou: "ありがとうございました! フィードバックが送信されました。",
    
    account: "アカウント",
    preferences: "設定",
    app: "アプリケーション",
    support: "サポート",
    aboutEcoSnap: "EcoSnapについて",
    logout: "ログアウト",
    
    submitting: "送信中…",
    updating: "更新中…",
    deleting: "削除中…",
    saving: "保存中…",
    empty: "値を入力してください。",
    alreadyEmail: "それはすでにあなたの現在のメールです。",
    passwordsNotMatch: "パスワードが一致しません。",
    passwordLength: "パスワードは6文字以上である必要があります。",
    selectRating: "スター評価を選択してください。",
    failedSubmit: "リクエストの送信に失敗しました。",
    failedSave: "プロフィールの保存に失敗しました。",
    failedUpdate: "パスワードの更新に失敗しました。",
    failedDelete: "アカウントの削除に失敗しました。",
  },
};

// ─── Language helpers ─────────────────────────────────────────────

const getLanguage = () => {
  const stored = localStorage.getItem("language");
  if (stored && TRANSLATIONS[stored]) return stored;
  return "en";
};

const setLanguageAndPersist = (lang) => {
  if (TRANSLATIONS[lang]) {
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;
  }
};

const t = (key, lang = null) => {
  const currentLang = lang || getLanguage();
  return TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS["en"]?.[key] || key;
};

// ─── API helpers ──────────────────────────────────────────────────

const updateUserProfile = async (id, userData) => {
  const response = await fetch(`http://localhost:8080/api/users/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Update failed");
  }
  return response.json();
};

const requestEmailChange = async (id, newEmail) => {
  const response = await fetch(`http://localhost:8080/api/users/${id}/request-email-change`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newEmail }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Request failed");
  }
  return response.json();
};

const deleteUserAccount = async (id) => {
  const response = await fetch(`http://localhost:8080/api/users/delete/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Delete failed");
  }
  return response.json();
};

const submitFeedback = async (feedbackData) => {
  const response = await fetch("http://localhost:8080/api/feedback/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(feedbackData),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to submit feedback");
  }
  return response.json();
};

// ─── Theme helpers ────────────────────────────────────────────────

const getTheme = () => {
  const stored = localStorage.getItem("theme");
  if (stored) return stored;
  const bodyTheme = document.body.getAttribute("data-theme");
  if (bodyTheme) return bodyTheme;
  return "light";
};

const setThemeAndPersist = (theme) => {
  localStorage.setItem("theme", theme);

  let resolved = theme;
  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    resolved = prefersDark ? "dark" : "light";
  }

  document.documentElement.setAttribute("data-theme", resolved);
  document.documentElement.style.colorScheme = resolved;
  document.body.setAttribute("data-theme", resolved);
};

// ─── Profile Panel ────────────────────────────────────────────────

function ProfilePanel({ user, setUser }) {
  const lang = getLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ ...user, bio: user.bio ?? "" });
  const [preview, setPreview] = useState(user.photoUrl);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const fileInputRef = useRef(null);

  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    setForm({ ...user, bio: user.bio ?? "" });
    setPreview(user.photoUrl);
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`http://localhost:8080/api/users/get/${user.id}`)
      .then((res) => res.json())
      .then((fresh) => {
        const merged = { ...userRef.current, ...fresh };
        setUser(merged);
        localStorage.setItem("user", JSON.stringify(merged));
      })
      .catch(() => {});
  }, [user?.id, setUser]);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setForm({ ...form, photoUrl: url });
  };

  const canChangeUsername = () => {
    if (!user.lastUsernameChange) return true;
    const last = new Date(user.lastUsernameChange);
    const nextAllowed = new Date(last);
    nextAllowed.setMonth(nextAllowed.getMonth() + 1);
    return new Date() >= nextAllowed;
  };

  const nextUsernameChangeDate = () => {
    if (!user.lastUsernameChange) return null;
    const last = new Date(user.lastUsernameChange);
    const next = new Date(last);
    next.setMonth(next.getMonth() + 1);
    return next.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const handleSave = async () => {
    if (form.username !== user.username && !canChangeUsername()) {
      setMsg({ type: "error", text: `${t("usernameChangeLimit", lang)} ${nextUsernameChangeDate()}` });
      return;
    }
    try {
      setSaving(true);
      setMsg(null);
      const updated = await updateUserProfile(user.id, {
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        bio: form.bio,
        photoUrl: form.photoUrl,
      });
      const merged = { ...user, ...updated };
      setUser(merged);
      localStorage.setItem("user", JSON.stringify(merged));
      setIsEditing(false);
      setMsg({ type: "success", text: t("profileUpdated", lang) });
    } catch (err) {
      setMsg({ type: "error", text: err.message || t("failedSave", lang) });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({ ...user, bio: user.bio ?? "" });
    setPreview(user.photoUrl);
    setIsEditing(false);
    setMsg(null);
  };

  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">{t("profileTitle", lang)}</h2>
        <p className="panel-subtitle">{t("profileSubtitle", lang)}</p>
      </div>
      <div className="section-card">
        <div className="avatar-row">
          <div
            className="avatar"
            style={
              preview || user.photoUrl
                ? { backgroundImage: `url(${preview || user.photoUrl})`, backgroundSize: "cover", color: "transparent" }
                : {}
            }
          >
            {!preview && !user.photoUrl && initials}
          </div>
          <div className="avatar-info">
            <p className="avatar-name">{user.firstName} {user.lastName}</p>
            <span className="avatar-sub">{user.email}</span>
            <br />
            {isEditing && (
              <>
                <button className="btn-sm" onClick={() => fileInputRef.current.click()}>{t("changePhoto", lang)}</button>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoChange} />
              </>
            )}
          </div>
        </div>
        <div className="row2">
          <div className="field"><label>{t("firstName", lang)}</label><input value={form.firstName} onChange={update("firstName")} disabled={!isEditing} /></div>
          <div className="field"><label>{t("lastName", lang)}</label><input value={form.lastName} onChange={update("lastName")} disabled={!isEditing} /></div>
        </div>
        <div className="field">
          <label>{t("bio", lang)}</label>
          <input value={form.bio} onChange={update("bio")} placeholder="Tell us a little about yourself…" disabled={!isEditing} />
        </div>
        <div className="field">
          <label>{t("username", lang)}</label>
          <input value={form.username} onChange={update("username")} disabled={!isEditing || !canChangeUsername()} />
          {isEditing && !canChangeUsername() && (
            <p style={{ fontSize: 12, color: "#f59e0b", marginTop: 4 }}>
              {t("usernameChangeLimit", lang)} {nextUsernameChangeDate()}
            </p>
          )}
          {isEditing && canChangeUsername() && (
            <p style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{t("canChangeUsername", lang)}</p>
          )}
        </div>
        <div className="field">
          <label>{t("email", lang)}</label>
          <input value={user.email} disabled={true} />
          <p style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
            {t("emailChangeNote", lang)}
          </p>
        </div>
      </div>
      {msg && <p className={`msg ${msg.type}`}>{msg.type === "success" ? "✓ " : "✕ "}{msg.text}</p>}
      {!isEditing ? (
        <button className="save-btn" onClick={() => setIsEditing(true)}>{t("editProfile", lang)}</button>
      ) : (
        <div style={{ display: "flex", gap: "12px" }}>
          <button className="save-btn" onClick={handleSave} disabled={saving}>{saving ? t("saving", lang) : t("saveChanges", lang)}</button>
          <button className="btn-sm" onClick={handleCancel} style={{ padding: "10px 20px" }}>{t("cancel", lang)}</button>
        </div>
      )}
    </div>
  );
}

// ─── Security Panel ───────────────────────────────────────────────

function SecurityPanel({ user, setUser }) {
  const lang = getLanguage();
  const navigate = useNavigate();

  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`http://localhost:8080/api/users/get/${user.id}`)
      .then((res) => res.json())
      .then((fresh) => {
        const merged = { ...userRef.current, ...fresh };
        setUser(merged);
        localStorage.setItem("user", JSON.stringify(merged));
      })
      .catch(() => {});
  }, [user?.id, setUser]);

  const [newEmail, setNewEmail]       = useState("");
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailMsg, setEmailMsg]       = useState(null);

  const handleRequestEmailChange = async () => {
    if (!newEmail.trim()) { setEmailMsg({ type: "error", text: t("empty", lang) }); return; }
    if (newEmail === user.email) { setEmailMsg({ type: "error", text: t("alreadyEmail", lang) }); return; }
    try {
      setEmailSaving(true);
      setEmailMsg(null);
      const updated = await requestEmailChange(user.id, newEmail);
      const merged = { ...user, ...updated };
      setUser(merged);
      localStorage.setItem("user", JSON.stringify(merged));
      setEmailMsg({ type: "success", text: "Request submitted! The admin will review and approve your email change." });
      setNewEmail("");
    } catch (err) {
      setEmailMsg({ type: "error", text: err.message || t("failedSubmit", lang) });
    } finally {
      setEmailSaving(false);
    }
  };

  const [pw, setPw]             = useState({ next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg]       = useState(null);
  const updatePw = (k) => (e) => setPw({ ...pw, [k]: e.target.value });

  const handleUpdatePassword = async () => {
    if (!pw.next) { setPwMsg({ type: "error", text: t("empty", lang) }); return; }
    if (pw.next.length < 6) { setPwMsg({ type: "error", text: t("passwordLength", lang) }); return; }
    if (pw.next !== pw.confirm) { setPwMsg({ type: "error", text: t("passwordsNotMatch", lang) }); return; }
    try {
      setPwSaving(true);
      setPwMsg(null);
      await updateUserProfile(user.id, { ...user, password: pw.next });
      setPw({ next: "", confirm: "" });
      setPwMsg({ type: "success", text: "Password updated successfully." });
    } catch (err) {
      setPwMsg({ type: "error", text: err.message || t("failedUpdate", lang) });
    } finally {
      setPwSaving(false);
    }
  };

  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to permanently delete your account? This cannot be undone.");
    if (!confirmed) return;
    try {
      setDeleting(true);
      await deleteUserAccount(user.id);
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    } catch (err) {
      alert(err.message || t("failedDelete", lang));
      setDeleting(false);
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">{t("securityTitle", lang)}</h2>
        <p className="panel-subtitle">{t("securitySubtitle", lang)}</p>
      </div>
      <div className="section-card">
        <h4 className="card-section-title">{t("emailAddress", lang)}</h4>
        <div className="field"><label>{t("currentEmail", lang)}</label><input type="email" value={user.email} disabled /></div>
        {user.emailChangeRequested ? (
          <div style={{ background: "#fef9c3", border: "1px solid #fde047", borderRadius: 8, padding: "12px 16px", marginBottom: 12 }}>
            <p style={{ fontSize: 13, color: "#854d0e", margin: 0 }}>
              {t("emailPending", lang)} <strong>{user.pendingEmail}</strong>. {t("waitingApproval", lang)}
            </p>
          </div>
        ) : (
          <>
            <div className="field">
              <label>{t("newEmailAddress", lang)}</label>
              <input type="email" placeholder="Enter new email" value={newEmail} onChange={(e) => { setNewEmail(e.target.value); setEmailMsg(null); }} />
            </div>
            <p style={{ fontSize: 12, color: "#888", marginBottom: 10 }}>
              {t("emailChangeNote2", lang)}
            </p>
            {emailMsg && <p className={`msg ${emailMsg.type}`}>{emailMsg.type === "success" ? "✓ " : "✕ "}{emailMsg.text}</p>}
            <button className="btn-sm" onClick={handleRequestEmailChange} disabled={emailSaving}>
              {emailSaving ? t("submitting", lang) : t("requestEmailChange", lang)}
            </button>
          </>
        )}
      </div>
      <div className="section-card">
        <h4 className="card-section-title">{t("password", lang)}</h4>
        <div className="field"><label>{t("newPassword", lang)}</label><input type="password" placeholder="••••••••" value={pw.next} onChange={updatePw("next")} /></div>
        <div className="field"><label>{t("confirmPassword", lang)}</label><input type="password" placeholder="••••••••" value={pw.confirm} onChange={updatePw("confirm")} /></div>
        {pwMsg && <p className={`msg ${pwMsg.type}`}>{pwMsg.type === "success" ? "✓ " : "✕ "}{pwMsg.text}</p>}
        <button className="save-btn" onClick={handleUpdatePassword} disabled={pwSaving}>{pwSaving ? t("updating", lang) : t("updatePassword", lang)}</button>
      </div>
      <div className="section-card danger-zone">
        <h4 className="card-section-title">{t("dangerZone", lang)}</h4>
        <div className="toggle-row">
          <div><div className="toggle-label">{t("deleteAccount", lang)}</div><div className="toggle-sub">{t("deleteAccountConfirm", lang)}</div></div>
          <button className="danger-link" onClick={handleDeleteAccount} disabled={deleting}>{deleting ? t("deleting", lang) : t("deleteAccount", lang)}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────

function Toggle({ defaultChecked = false }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <label className="toggle">
      <input type="checkbox" checked={on} onChange={() => setOn(!on)} />
      <span className="slider-t" />
    </label>
  );
}

// ─── Notifications Panel ──────────────────────────────────────────

function NotificationsPanel() {
  const lang = getLanguage();
  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">{t("notifications", lang)}</h2>
        <p className="panel-subtitle">{t("notificationsSubtitle", lang)}</p>
      </div>
      <div className="section-card">
        <h4 className="card-section-title">{t("pushNotifications", lang)}</h4>
        <div className="toggle-row"><div><div className="toggle-label">{t("scanReminders", lang)}</div><div className="toggle-sub">{t("dailyNudge", lang)}</div></div><Toggle defaultChecked /></div>
        <div className="toggle-row"><div><div className="toggle-label">{t("ecoTips", lang)}</div><div className="toggle-sub">{t("weeklySustainability", lang)}</div></div><Toggle defaultChecked /></div>
        <div className="toggle-row"><div><div className="toggle-label">{t("communityUpdates", lang)}</div><div className="toggle-sub">{t("newPosts", lang)}</div></div><Toggle /></div>
      </div>
      <div className="section-card">
        <h4 className="card-section-title">{t("emailNotifications", lang)}</h4>
        <div className="toggle-row"><div><div className="toggle-label">{t("newsletter", lang)}</div><div className="toggle-sub">{t("monthlyDigest", lang)}</div></div><Toggle defaultChecked /></div>
        <div className="toggle-row"><div><div className="toggle-label">{t("productAnnouncements", lang)}</div><div className="toggle-sub">{t("newFeatures", lang)}</div></div><Toggle /></div>
      </div>
    </div>
  );
}

// ─── Appearance Panel ─────────────────────────────────────────────

function AppearancePanel() {
  const lang = getLanguage();
  const [theme, setTheme] = useState(() => getTheme());
  const [fontSize, setFontSize] = useState("medium");
  const [accent, setAccent] = useState("#22c55e");
  const accents = ["#22c55e", "#3b82f6", "#a855f7", "#f97316", "#ec4899"];

  useEffect(() => {
    setThemeAndPersist(theme);
  }, [theme]);

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">{t("appearance", lang)}</h2>
        <p className="panel-subtitle">{t("appearanceSubtitle", lang)}</p>
      </div>
      <div className="section-card">
        <h4 className="card-section-title">{t("theme", lang)}</h4>
        <div className="theme-grid">
          {["light", "dark", "system"].map((t) => (
            <div key={t} className={`theme-opt${theme === t ? " sel" : ""}`} onClick={() => setTheme(t)}>
              <span className="theme-icon">{t === "light" ? "☀️" : t === "dark" ? "🌙" : "⚙️"}</span>
              {TRANSLATIONS[lang][t] || t.charAt(0).toUpperCase() + t.slice(1)}
            </div>
          ))}
        </div>
      </div>
      <div className="section-card">
        <h4 className="card-section-title">{t("textSize", lang)}</h4>
        <div className="field"><label>{t("fontSize", lang)}</label><select value={fontSize} onChange={(e) => setFontSize(e.target.value)}><option value="small">{t("small", lang)}</option><option value="medium">{t("medium", lang)}</option><option value="large">{t("large", lang)}</option></select></div>
      </div>
      <div className="section-card">
        <h4 className="card-section-title">{t("accentColor", lang)}</h4>
        <div className="accent-row">
          {accents.map((c) => (
            <div key={c} className={`accent-swatch${accent === c ? " sel" : ""}`} style={{ background: c, border: accent === c ? `2px solid ${c}` : "2px solid transparent" }} onClick={() => setAccent(c)} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Language Panel ───────────────────────────────────────────────

function LanguagePanel({ onLanguageChange }) {
  const lang = getLanguage();
  const [language, setLanguage] = useState(() => getLanguage());
  const [region, setRegion] = useState(() => localStorage.getItem("region") || "ph");
  const [timeZone, setTimeZone] = useState(() => localStorage.getItem("timeZone") || "manila");
  const [dateFormat, setDateFormat] = useState(() => localStorage.getItem("dateFormat") || "mdy");
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setLanguageAndPersist(newLang);
    if (onLanguageChange) onLanguageChange(newLang);
    setMsg({ type: "success", text: `Language changed!` });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleSavePreferences = async () => {
    try {
      setSaving(true);
      setMsg(null);
      
      localStorage.setItem("region", region);
      localStorage.setItem("timeZone", timeZone);
      localStorage.setItem("dateFormat", dateFormat);
      
      setMsg({ type: "success", text: t("preferencesSaved", lang) });
      setTimeout(() => setMsg(null), 3000);
    } catch (err) {
      setMsg({ type: "error", text: err.message || t("failedSave", lang) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">{t("languageRegionTitle", lang)}</h2>
        <p className="panel-subtitle">{t("languageRegionSubtitle", lang)}</p>
      </div>
      <div className="section-card">
        <div className="field">
          <label>{t("language", lang)}</label>
          <select value={language} onChange={(e) => handleLanguageChange(e.target.value)}>
            <option value="en">English (US)</option>
            <option value="fil">Filipino (Tagalog)</option>
            <option value="es">Español</option>
            <option value="ja">日本語</option>
          </select>
        </div>
        <div className="field">
          <label>{t("region", lang)}</label>
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="ph">Philippines</option>
            <option value="us">United States</option>
            <option value="es">Spain</option>
            <option value="mx">Mexico</option>
            <option value="jp">Japan</option>
          </select>
        </div>
        <div className="field">
          <label>{t("timeZone", lang)}</label>
          <select value={timeZone} onChange={(e) => setTimeZone(e.target.value)}>
            <option value="manila">Asia/Manila (UTC+8)</option>
            <option value="ny">America/New_York (UTC-5)</option>
            <option value="tokyo">Asia/Tokyo (UTC+9)</option>
            <option value="london">Europe/London (UTC+0)</option>
            <option value="sydney">Australia/Sydney (UTC+10)</option>
          </select>
        </div>
        <div className="field">
          <label>{t("dateFormat", lang)}</label>
          <select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)}>
            <option value="mdy">MM/DD/YYYY</option>
            <option value="dmy">DD/MM/YYYY</option>
            <option value="ymd">YYYY-MM-DD</option>
          </select>
        </div>
      </div>
      {msg && <p className={`msg ${msg.type}`}>{msg.type === "success" ? "✓ " : "✕ "}{msg.text}</p>}
      <button className="save-btn" onClick={handleSavePreferences} disabled={saving}>
        {saving ? t("saving", lang) : t("savePreferences", lang)}
      </button>
    </div>
  );
}

// ─── Privacy Panel ────────────────────────────────────────────────

function PrivacyPanel() {
  const lang = getLanguage();
  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">{t("privacy", lang)}</h2>
        <p className="panel-subtitle">{t("privacySubtitle", lang)}</p>
      </div>
      <div className="section-card">
        <h4 className="card-section-title">{t("dataSharing", lang)}</h4>
        <div className="toggle-row"><div><div className="toggle-label">{t("analytics", lang)}</div><div className="toggle-sub">{t("helpImprove", lang)}</div></div><Toggle defaultChecked /></div>
        <div className="toggle-row"><div><div className="toggle-label">{t("personalizedSuggestions", lang)}</div><div className="toggle-sub">{t("useScanHistory", lang)}</div></div><Toggle defaultChecked /></div>
        <div className="toggle-row"><div><div className="toggle-label">{t("locationData", lang)}</div><div className="toggle-sub">{t("usedForRecycling", lang)}</div></div><Toggle /></div>
      </div>
      <div className="section-card">
        <h4 className="card-section-title">{t("yourData", lang)}</h4>
        <div className="toggle-row"><div><div className="toggle-label">{t("exportData", lang)}</div><div className="toggle-sub">{t("downloadCopy", lang)}</div></div><button className="btn-sm">{t("export", lang)}</button></div>
      </div>
    </div>
  );
}

// ─── Storage Panel ────────────────────────────────────────────────

function StoragePanel() {
  const lang = getLanguage();
  const used = 68, total = 200;
  const pct = Math.round((used / total) * 100);
  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">{t("storage", lang)}</h2>
        <p className="panel-subtitle">{t("storageSubtitle", lang)}</p>
      </div>
      <div className="section-card">
        <h4 className="card-section-title">{t("storageUsed", lang)}</h4>
        <div className="storage-label-row"><span className="storage-sub">{used} MB of {total} MB used</span><span className="storage-pct">{pct}%</span></div>
        <div className="storage-bar"><div className="storage-fill" style={{ width: `${pct}%` }} /></div>
        <div className="storage-grid">
          <div className="metric-card"><div className="metric-label">{t("scanHistory", lang)}</div><div className="metric-value">52 MB</div></div>
          <div className="metric-card"><div className="metric-label">{t("cachedImages", lang)}</div><div className="metric-value">16 MB</div></div>
        </div>
      </div>
      <div className="section-card">
        <h4 className="card-section-title">{t("clearData", lang)}</h4>
        <div className="toggle-row"><div><div className="toggle-label">{t("clearCached", lang)}</div><div className="toggle-sub">{t("freesUp", lang)} 16 MB</div></div><button className="btn-sm">{t("clear", lang)}</button></div>
        <div className="toggle-row"><div><div className="toggle-label">{t("clearScanHistory", lang)}</div><div className="toggle-sub">{t("cannotUndo", lang)}</div></div><button className="danger-link">{t("clear", lang)}</button></div>
      </div>
    </div>
  );
}

// ─── Sessions Panel ───────────────────────────────────────────────

function SessionsPanel() {
  const lang = getLanguage();
  const sessions = [
    { id: 1, icon: "📱", name: "iPhone 15 · EcoSnap iOS", detail: "Manila, PH · Active now", current: true },
    { id: 2, icon: "💻", name: "Chrome on Windows", detail: "Iloilo, PH · 2 days ago", current: false },
    { id: 3, icon: "📱", name: "Samsung Galaxy S23", detail: "Cebu, PH · 1 week ago", current: false },
  ];
  const [list, setList] = useState(sessions);
  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">{t("sessions", lang)}</h2>
        <p className="panel-subtitle">{t("sessionsSubtitle", lang)}</p>
      </div>
      <div className="section-card">
        <h4 className="card-section-title">{t("loggedInDevices", lang)}</h4>
        {list.map((s) => (
          <div className="session-row" key={s.id}>
            <div className="session-icon">{s.icon}</div>
            <div className="session-info"><p className="session-name">{s.name}</p><span className="session-detail">{s.detail}</span></div>
            {s.current ? <span className="badge">{t("current", lang)}</span> : <button className="danger-link" onClick={() => setList(list.filter((x) => x.id !== s.id))}>{t("revoke", lang)}</button>}
          </div>
        ))}
      </div>
      <button className="btn-sm danger" onClick={() => setList(list.filter((s) => s.current))}>{t("revokeAll", lang)}</button>
    </div>
  );
}

// ─── Feedback Panel ───────────────────────────────────────────────

const FEEDBACK_CATEGORIES = ["General", "UI / Design", "Performance", "Scan Accuracy", "Tips & Facts", "Bug Report", "Feature Request", "Other"];
const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

function FeedbackPanel({ user }) {
  const lang = getLanguage();
  const [hoverRating, setHoverRating]       = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedCats, setSelectedCats]     = useState([]);
  const [feedbackText, setFeedbackText]     = useState("");
  const [submitting, setSubmitting]         = useState(false);
  const [status, setStatus]                 = useState(null);

  const toggleCat = (cat) =>
    setSelectedCats((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);

  const handleSubmit = async () => {
    if (!selectedRating) {
      setStatus({ type: "error", text: t("selectRating", lang) });
      return;
    }
    try {
      setSubmitting(true);
      setStatus(null);
      await submitFeedback({
        userName: user ? `${user.firstName} ${user.lastName}` : "Anonymous",
        userEmail: user?.email ?? "",
        rating: selectedRating,
        categories: selectedCats.join(", "),
        message: feedbackText.trim(),
        submittedAt: new Date().toISOString(),
      });
      setSelectedRating(0);
      setSelectedCats([]);
      setFeedbackText("");
      setStatus({ type: "success", text: t("thankYou", lang) });
    } catch (err) {
      setStatus({ type: "error", text: err.message || "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (status?.type === "success") {
      const t = setTimeout(() => setStatus(null), 5000);
      return () => clearTimeout(t);
    }
  }, [status]);

  const displayRating = hoverRating || selectedRating;
  const ratingLabels = {
    en: RATING_LABELS,
    fil: ["", "Mahinang", "Katamtaman", "Mabuti", "Napakabuti", "Napakahusay"],
    es: ["", "Pobre", "Regular", "Bueno", "Muy bueno", "Excelente"],
    ja: ["", "悪い", "普通", "良い", "非常に良い", "優秀"],
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">{t("feedback", lang)}</h2>
        <p className="panel-subtitle">{t("feedbackSubtitle", lang)}</p>
      </div>
      <div className="section-card">
        <h4 className="card-section-title">{t("overallExperience", lang)}</h4>
        <div className="feedback-stars">
          {[1, 2, 3, 4, 5].map((val) => (
            <span
              key={val}
              className={`feedback-star${displayRating >= val ? " active" : ""}`}
              onMouseEnter={() => setHoverRating(val)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => { setSelectedRating(val); setStatus(null); }}
            >★</span>
          ))}
        </div>
        <p className="feedback-rating-label">
          {displayRating ? ratingLabels[lang][displayRating] : t("tapStar", lang)}
        </p>
      </div>
      <div className="section-card">
        <h4 className="card-section-title">{t("aboutFeedback", lang)}</h4>
        <div className="feedback-chips">
          {FEEDBACK_CATEGORIES.map((cat) => (
            <button key={cat} className={`feedback-chip${selectedCats.includes(cat) ? " selected" : ""}`} onClick={() => toggleCat(cat)}>{cat}</button>
          ))}
        </div>
      </div>
      <div className="section-card">
        <h4 className="card-section-title">{t("tellMore", lang)}</h4>
        <div className="field">
          <textarea
            className="feedback-textarea"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder={t("sharethoughts", lang)}
          />
        </div>
      </div>
      <div className="feedback-submit-row">
        <button className="save-btn" onClick={handleSubmit} disabled={submitting}>
          {submitting ? t("submitting", lang) : t("submitFeedback", lang)}
        </button>
        {status && (
          <span className={`msg ${status.type}`}>{status.type === "success" ? "✓ " : "✕ "}{status.text}</span>
        )}
      </div>
    </div>
  );
}

// ─── Sidebar config ───────────────────────────────────────────────

const getSidebarConfig = (lang) => [
  { group: t("account", lang), items: [{ id: "profile", label: t("profileTitle", lang) }, { id: "security", label: t("securityTitle", lang) }] },
  { group: t("preferences", lang), items: [{ id: "notifications", label: t("notifications", lang) }, { id: "appearance", label: t("appearance", lang) }, { id: "language", label: t("language", lang) }] },
  { group: t("app", lang), items: [{ id: "privacy", label: t("privacy", lang) }, { id: "storage", label: t("storage", lang) }, { id: "sessions", label: t("sessions", lang) }, { id: "feedback", label: t("feedback", lang) }] },
  { group: t("support", lang), items: [{ id: "about", label: t("aboutEcoSnap", lang), isLink: true, to: "/about" }] },
];

// ─── Main Settings component ──────────────────────────────────────

export default function Settings({ user, setUser }) {
  const navigate = useNavigate();
  const [active, setActive] = useState("profile");
  const [, setLanguageKey] = useState(0); // Force re-render on language change

  useEffect(() => {
    const savedTheme = getTheme();
    setThemeAndPersist(savedTheme);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleLanguageChange = (newLang) => {
    setLanguageKey(prev => prev + 1); // Force re-render
  };

  const currentLang = getLanguage();
  const sidebarConfig = getSidebarConfig(currentLang);

  return (
    <div className="settings-page">
      <div className="settings-body">
        <div className="sidebar">
          {sidebarConfig.map(({ group, items }) => (
            <div key={group}>
              <h3>{group}</h3>
              <ul>
                {items.map(({ id, label, isLink, to }) => (
                  <li key={id} className={active === id ? "active" : ""} onClick={() => !isLink && setActive(id)}>
                    {isLink ? <Link to={to}>{label}</Link> : label}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <button className="logout" onClick={handleLogout}>{t("logout", currentLang)}</button>
        </div>
        <div className="content">
          {active === "profile"       && <ProfilePanel user={user} setUser={setUser} />}
          {active === "security"      && <SecurityPanel user={user} setUser={setUser} />}
          {active === "notifications" && <NotificationsPanel />}
          {active === "appearance"    && <AppearancePanel />}
          {active === "language"      && <LanguagePanel onLanguageChange={handleLanguageChange} />}
          {active === "privacy"       && <PrivacyPanel />}
          {active === "storage"       && <StoragePanel />}
          {active === "sessions"      && <SessionsPanel />}
          {active === "feedback"      && <FeedbackPanel user={user} />}
        </div>
      </div>
    </div>
  );
}