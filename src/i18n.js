// ─── Comprehensive Translation System for EcoSnap ─────────────────

const TRANSLATIONS = {
  en: {
    // ═══════════════════════════════════════════════════════════════
    // NAVBAR & NAVIGATION
    // ═══════════════════════════════════════════════════════════════
    dashboard: 'Dashboard',
    history: 'History',
    tipsAndFacts: 'Tips & Facts',
    settings: 'Settings',
    notifications: 'Notifications',
    youreAllCaughtUp: "You're all caught up!",
    markAllRead: 'Mark all read',
    clearAll: 'Clear all',

    // ═══════════════════════════════════════════════════════════════
    // DASHBOARD
    // ═══════════════════════════════════════════════════════════════
    welcomeBack: 'Welcome back',
    ecoWarrior: 'Eco-Warrior',
    startScanning: "Start scanning items to track your recycling journey.",
    scanNewItem: 'Scan new Item',
    scanNewItemLong: 'Start scanning items to track your recycling journey.',
    aboutUs: 'About Us',
    contactUs: 'Contact Us',
    privacyPolicy: 'Privacy Policy',
    termsOfUse: 'Terms of Use',
    totalScans: 'Total Scans',
    noScansYet: 'No scans yet',
    getStarted: 'Get started!',
    itemsRecycled: 'Items Recycled',
    recyclingRate: 'Recycling Rate',
    buildYourRate: 'Scan to build your rate',
    wasteDiverted: 'Waste Diverted',
    yourImpactStartsHere: 'Your impact starts here',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    allTime: 'All Time',
    plastic: 'Plastic',
    paper: 'Paper',
    glass: 'Glass',
    metal: 'Metal',
    recyclingRateImproves: 'Your recycling rate improves as you scan and recycle more items.',
    everyKilogramDiverted: 'Every kilogram diverted from landfill reduces CO₂ emissions.',

    // ═══════════════════════════════════════════════════════════════
    // SCANNER
    // ═══════════════════════════════════════════════════════════════
    scanAnItem: 'Scan an item to classify it',
    takePhotoUpload: 'Take a photo or upload an image — AI will identify the trash category',
    openCamera: 'Open Camera',
    uploadImage: 'Upload Image',
    capturePhoto: 'Capture Photo',
    close: 'Close',
    analyzeItem: 'Analyze Item',
    retake: 'Retake',
    chooseDifferent: 'Choose Different',
    analyzing: 'Analyzing...',
    analyzeThisMayTake: 'Analyzing... This may take a moment due to API rate limits.',
    scanComplete: 'Scan Complete',
    analysisComplete: 'Analysis completed in',
    ms: 'ms',
    recyclable: 'Recyclable',
    biodegradable: 'Biodegradable',
    hazardous: 'Hazardous',
    eWaste: 'E-Waste',
    residualNonRecyclable: 'Residual / Non-Recyclable',
    unknown: 'Unknown',
    confidence: 'Confidence',
    howToDispose: 'How to dispose:',
    placeInBlueYellow: 'Place in the blue/yellow recycling bin.',
    placeInGreenCompost: 'Place in the green compost bin or compost at home.',
    placeInBlack: 'Place in the general waste / black bin.',
    bringToHazardous: 'Bring to a designated hazardous waste facility.',
    dropOffElectronics: 'Drop off at an electronics recycling center.',
    couldNotDetermine: 'Could not determine category. Try a clearer photo.',
    scanAnother: 'Scan Another',
    cameraPermissionDenied: 'Camera permission denied. Please allow camera access.',
    noCameraFound: 'No camera found on this device.',
    failedAccessCamera: 'Failed to access camera.',
    cameraError: 'Camera Error',
    cameraNotReady: 'Camera is not ready.',
    cameraStreamNotReady: 'Camera stream is not ready. Please wait and try again.',
    cannotAccessCanvas: 'Cannot access canvas. Please try again.',
    canvasError: 'Canvas Error',
    failedCapturePhoto: 'Failed to capture photo.',
    captureError: 'Capture Error',
    photoCapture: 'Photo Ready',
    photoReady: 'Photo captured!',
    imageTooLarge: 'Image is too large (max 4MB).',
    fileTooLarge: 'File Too Large',
    invalidImageFile: 'Please select a valid image file.',
    invalidFile: 'Invalid File',
    imageLoaded: 'Image Ready',
    imageLoadedMsg: 'Image loaded!',
    failedReadImage: 'Failed to read image file.',
    readError: 'Read Error',
    analysisFailedAfter: 'Analysis failed after',
    attempts: 'attempts:',
    failedAnalysis: 'Analysis Failed',
    identified: 'identified as',

    // ═══════════════════════════════════════════════════════════════
    // HISTORY
    // ═══════════════════════════════════════════════════════════════
    scanHistory: 'Scan History',
    allYourScanned: 'All your scanned items in one place.',
    all: 'All',
    totalScansHistory: 'Total Scans',
    recycledCount: 'Items Recycled',
    recyclingRateHistory: 'Recycling Rate',
    wasteDivertedHistory: 'Waste Diverted',
    showingItems: 'Showing:',
    items: 'items',
    noItemsYet: 'No',
    itemsYet: 'items yet',
    scanSome: 'Scan some',
    wasteToBeSeen: 'waste to see it here.',
    scanYourFirstItem: 'Scan your first item',

    // ═══════════════════════════════════════════════════════════════
    // PROFILE
    // ═══════════════════════════════════════════════════════════════
    yourEnvironmental: 'Your Environmental Impact',
    treesHelped: 'Trees Helped',
    co2Saved: 'CO₂ Saved',
    itemsSorted: 'Items Sorted',
    impactPoints: 'Impact Points',
    yourScanningStats: 'Your Scanning Stats',
    totalScansProfile: 'Total Scans',
    recyclableProfile: 'Recyclable',
    biodegradableProfile: 'Biodegradable',
    hazardousEWaste: 'Hazardous/E-Waste',
    recentScans: 'Recent Scans',
    achievements: 'Achievements',
    firstStep: 'First Step',
    completedFirstScan: 'Completed your first scan',
    ecoScout: 'Eco Scout',
    scansCompleted: 'scans completed',
    planetGuardian: 'Planet Guardian',
    scansCompleted25: '25 scans completed',
    wasteWarrior: 'Waste Warrior',
    scansCompleted50: '50 scans completed',
    ecoChampion: 'Eco Champion',
    scansCompleted100: '100 scans completed',
    recycler: 'Recycler',
    recyclablesLabel: '10+ recyclables',
    composter: 'Composter',
    compostablesLabel: '10+ compostables',
    safetyFirst: 'Safety First',
    hazardousItemsLabel: '5+ hazardous items',
    startScanning: 'Start Scanning',
    joined: 'Joined',
    wasteClassificationSpecialist: 'Waste Classification Specialist',
    edit: 'Edit',
    scanHistoryBtn: 'Scan History',
    settingsBtn: 'Settings',

    // ═══════════════════════════════════════════════════════════════
    // TIPS & FACTS
    // ═══════════════════════════════════════════════════════════════
    todaysEcoTip: "Today's Eco Tip",
    savedTips: 'Saved Tips',
    allTips: 'All Tips',
    searchTipsAndFacts: 'Search tips and facts…',
    youHaventSaved: "You haven't saved any tips yet. Tap 🏷️ on a card to bookmark it!",
    noTipsMatch: 'No tips match your search.',
    loadingTips: 'Loading tips…',
    couldNotLoadTips: 'Could not load tips',
    backToTip: 'Back to tip',
    funFact: 'Fun fact',
    removeBoomark: 'Remove bookmark',
    bookmarkThisTip: 'Bookmark this tip',
    didYouKnow: 'Did you know?',
    noFunFactAdded: 'No fun fact added yet.',

    // ═══════════════════════════════════════════════════════════════
    // SETTINGS
    // ═══════════════════════════════════════════════════════════════
    profile: 'Profile',
    security: 'Account & Security',
    appearance: 'Appearance',
    language: 'Language',
    languageRegion: 'Language & Region',
    privacy: 'Privacy & Data',
    storage: 'Storage & Usage',
    sessions: 'Active Sessions',
    feedback: 'Feedback',
    logout: 'Log Out',
    account: 'Account',
    preferences: 'Preferences',
    app: 'App',
    support: 'Support',
    aboutEcoSnap: 'About EcoSnap',
    
    // Profile Settings
    managePersonalInfo: 'Manage your personal information',
    firstName: 'First name',
    lastName: 'Last name',
    bio: 'Bio',
    username: 'Username',
    email: 'Email',
    changePhoto: 'Change photo',
    editProfile: 'Edit Profile',
    saveChanges: 'Save changes',
    cancel: 'Cancel',
    profileUpdatedSuccessfully: 'Profile updated successfully!',
    usernameCanOnlyChange: 'Username can only be changed once per month. Next allowed:',
    youCanChangeUsername: 'You can change your username once per month.',
    toChangeEmailGoTo: 'To change your email, go to Account & Security and submit a request to the admin.',
    
    // Security Settings
    manageAccountSecurity: 'Manage your account security and preferences',
    emailAddress: 'Email Address',
    currentEmail: 'Current email',
    newEmailAddress: 'New email address',
    emailChangesRequireAdmin: 'Email changes require admin approval. Your current email stays active until approved.',
    requestEmailChange: 'Request email change',
    pendingRequest: 'Pending request: You requested to change your email to',
    waitingForAdminApproval: 'Waiting for admin approval.',
    password: 'Password',
    newPassword: 'New password',
    confirmPassword: 'Confirm new password',
    updatePassword: 'Update password',
    deleteAccount: 'Delete account',
    dangerZone: 'Danger zone',
    permanentlyRemoveAccount: 'Permanently remove your account and all data',
    
    // Appearance
    customizeHowEcoSnapLooks: 'Customize how EcoSnap looks',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    textSize: 'Text size',
    fontSize: 'Font size',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    accentColor: 'Accent color',
    
    // Language
    setLanguageLocationPreferences: 'Set your language and location preferences',
    region: 'Region',
    timeZone: 'Time zone',
    dateFormat: 'Date format',
    savePreferences: 'Save preferences',
    preferencesSavedSuccessfully: 'Preferences saved successfully!',
    languageChangedTo: 'Language changed to',
    
    // Notifications
    controlHowYouReceiveUpdates: 'Control how you receive updates',
    pushNotifications: 'Push notifications',
    scanReminders: 'Scan reminders',
    dailyNudgeToScan: 'Daily nudge to scan items',
    ecoTips: 'Eco tips',
    weeklySustainability: 'Weekly sustainability tips',
    communityUpdates: 'Community updates',
    newPostsFromPeople: 'New posts from people you follow',
    emailNotifications: 'Email notifications',
    newsletter: 'Newsletter',
    monthlyEcoSnapDigest: 'Monthly EcoSnap digest',
    productAnnouncements: 'Product announcements',
    newFeaturesAndUpdates: 'New features and updates',
    
    // Privacy
    controlYourDataPrivacy: 'Control your data and privacy settings',
    dataSharing: 'Data sharing',
    analytics: 'Analytics',
    helpImproveEcoSnap: 'Help improve EcoSnap with usage data',
    personalizedSuggestions: 'Personalized suggestions',
    useScanHistoryForRecommendations: 'Use scan history for recommendations',
    locationData: 'Location data',
    usedForNearbyRecycling: 'Used for nearby recycling centers',
    yourData: 'Your data',
    exportMyData: 'Export my data',
    downloadCopyOfYourData: 'Download a copy of your EcoSnap data',
    export: 'Export',
    
    // Storage
    manageYourStorageSpace: 'Manage your storage space',
    storageUsed: 'Storage used',
    scanHistory: 'Scan history',
    cachedImages: 'Cached images',
    clearData: 'Clear data',
    clearCachedImages: 'Clear cached images',
    freesUp: 'Frees up',
    clearScanHistory: 'Clear scan history',
    cannotBeUndone: 'Cannot be undone',
    clear: 'Clear',
    
    // Sessions
    manageYourLoggedInDevices: 'Manage your logged-in devices',
    loggedInDevices: 'Logged-in devices',
    current: 'Current',
    revoke: 'Revoke',
    revokeAllOtherSessions: 'Revoke all other sessions',
    
    // Feedback
    helpUsImproveEcoSnap: 'Help us improve EcoSnap',
    overallExperience: 'Overall experience',
    whatIsYourFeedbackAbout: 'What is your feedback about?',
    tellUsMore: 'Tell us more (optional)',
    shareYourThoughts: 'Share your thoughts, suggestions, or report an issue…',
    submitFeedback: 'Submit feedback',
    general: 'General',
    uiDesign: 'UI / Design',
    performance: 'Performance',
    scanAccuracy: 'Scan Accuracy',
    tipsFacts: 'Tips & Facts',
    bugReport: 'Bug Report',
    featureRequest: 'Feature Request',
    other: 'Other',
    poor: 'Poor',
    fair: 'Fair',
    good: 'Good',
    veryGood: 'Very Good',
    excellent: 'Excellent',
    tapStarToRate: 'Tap a star to rate',
    thankYouFeedbackSubmitted: 'Thank you! Your feedback has been submitted.',
    
    // Form messages
    submitting: 'Submitting…',
    updating: 'Updating…',
    deleting: 'Deleting…',
    saving: 'Saving…',
    pleaseEnterValue: 'Please enter a value.',
    thatsAlreadyYourEmail: "That's already your current email.",
    passwordsDoNotMatch: 'Passwords do not match.',
    passwordMustBe: 'Password must be at least 6 characters.',
    selectStarRating: 'Please select a star rating.',
    failedToSubmit: 'Failed to submit request.',
    failedToSave: 'Failed to save profile.',
    failedToUpdate: 'Failed to update password.',
    failedToDelete: 'Failed to delete account.',

    // ═══════════════════════════════════════════════════════════════
    // ACCOUNT SECURITY PAGE
    // ═══════════════════════════════════════════════════════════════
    accountSecurityTitle: 'Account Security',
    protectYourEcoSnapProfile: 'Manage your login credentials and keep your EcoSnap profile protected.',
    updatePasswordRegularly: 'Update your password regularly to keep your account secure.',
    changePassword: 'Change password →',
    addSecondLayer: 'Add a second layer of security to verify your identity on login.',
    enable2FA: 'Enable 2FA →',
    reviewSignOut: 'Review and sign out of devices where your account is currently logged in.',
    manageSessions: 'Manage sessions →',
    securityTips: 'Security tips',
    useUnique: 'Use a unique password not used on other sites.',
    neverShare: 'Never share your login credentials with anyone.',
    enableTwoFactor: 'Enable two-factor authentication for extra protection.',

    // ═══════════════════════════════════════════════════════════════
    // PRIVACY POLICY
    // ═══════════════════════════════════════════════════════════════
    privacyPolicyTitle: 'Privacy Policy',
    yourPrivacyMatters: 'Your privacy matters to us. This policy explains what data EcoSnap collects, how we use it, and the choices you have.',
    lastUpdated: 'Last Updated:',
    atEcoSnap: 'At EcoSnap, we are committed to protecting your personal information and your right to privacy.',

    // ═══════════════════════════════════════════════════════════════
    // TERMS OF USE
    // ═══════════════════════════════════════════════════════════════
    termsOfUseTitle: 'Terms of Use',
    acceptanceOfTerms: 'Acceptance of Terms',
    byAccessing: 'By accessing and using EcoSnap, you agree to comply with and be bound by these Terms of Use. If you do not agree, please refrain from using the application.',
    userResponsibilities: 'User Responsibilities',
    asUserYouAgree: 'As a user of EcoSnap, you agree to:',
    provideAccurateInfo: 'Provide accurate information when creating an account.',
    useSolely: 'Use the AI scanning feature solely for identifying waste materials.',
    refrainiFromUploading: 'Refrain from uploading offensive or harmful content.',
    intellectualProperty: 'Intellectual Property',
    allContent: 'All content, including the EcoSnap logo, AI models, and interface design, is the property of EcoSnap and is protected by copyright laws in the Philippines.',
    limitationOfLiability: 'Limitation of Liability',
    whileWeStrive: 'While we strive for 100% accuracy in our waste classification, EcoSnap is not liable for misidentification of materials. Always follow local Cebu City disposal guidelines when in doubt.',
    changesToTerms: 'Changes to Terms',
    weReserveRight: 'We reserve the right to modify these terms at any time. Continued use of the app following changes constitutes acceptance of the new terms.',
    byClicking: 'By clicking "I Understand", you acknowledge that you have read and agree to EcoSnap\'s Terms of Use.',
    iUnderstand: 'I Understand',

    // ═══════════════════════════════════════════════════════════════
    // ABOUT US
    // ═══════════════════════════════════════════════════════════════
    snapItKnowIt: 'Snap it. Know it.',
    greenIt: 'Green it.',
    ecoSnapTurnsYourPhone: 'EcoSnap turns your phone into a recycling guide — making it effortless to do right by the planet, one scan at a time.',
    itemsScanned: 'Items Scanned',
    kgWasteDiverted: 'kg Waste Diverted',
    activeUsers: 'Active Users',
    scanAccuracyPercent: 'Scan Accuracy',
    ourMission: 'Our Mission',
    recyclingIsConfusing: 'Recycling is confusing. Rules vary by city. Labels are cryptic. Most well-meaning people give up — and waste ends up in landfill.',
    ecoSnapWasBuilt: 'EcoSnap was built to fix that. Point your camera at any item and we\'ll instantly tell you how to dispose of it correctly in your area — no guessing, no greenwashing, just clarity.',
    howEcoSnapWorks: 'How EcoSnap Works',
    snapAPhoto: 'Snap a Photo',
    pointYourCamera: 'Point your camera at any item — packaging, bottle, electronics, food container.',
    aiAnalysis: 'AI Analysis',
    ourModelIdentifies: 'Our model identifies the material and checks local recycling guidelines for your area.',
    clearGuidance: 'Clear Guidance',
    youGetSimple: 'You get a simple answer: recycle, compost, landfill, or drop-off point.',
    trackImpact: 'Track Impact',
    everyScanContributes: 'Every scan contributes to your personal eco-impact dashboard.',
    readyToMakeImpact: 'Ready to make an impact?',
    joinThousands: 'Join thousands of eco-conscious users already reducing waste with EcoSnap.',
    scanYourFirstItemBtn: 'Scan your first item',

    // ═══════════════════════════════════════════════════════════════
    // CONTACT US & SUPPORT
    // ═══════════════════════════════════════════════════════════════
    howCanWeHelp: 'Hi, how can we help?',
    generalSupport: 'General Support',
    scanningIssues: 'Scanning Issues',
    accountSecurityLink: 'Account Security',
    resources: 'Resources',
    customerServiceHow: '[Customer Service] How do I contact EcoSnap Support?',
    ecoGuideVersion: 'For the Eco-Guide version of this article, click here.',
    ecoSnapSupportCanBeReached: 'EcoSnap Support can be reached through the following channels:',
    liveChat: 'Live Chat:',
    chat24_7: '24/7 via the app',
    emailSupport: 'Email Support:',
    responseWithin24Hours: 'Response within 24 hours',
    noteForUrgent: 'Note:',
    forUrgentRecycling: 'For urgent recycling center inquiries, you can reach out directly to our Partner Network.',
    educationalResources: 'Educational Resources',
    downloadRecyclingGuide: 'Download Recycling Guide (PDF)',
    cebubCityLocal: 'Cebu City Local Waste Ordinances',
    ecoSnapAPIDocumentation: 'EcoSnap API Documentation',
    lighting: 'Lighting',
    makeSureItemWellLit: 'Make sure your item is well-lit — natural daylight or a bright indoor lamp works best.',
    focusDistance: 'Focus distance',
    holdYourPhone: 'Hold your phone 6–10 inches away from the item for a sharp, clear image.',
    angle: 'Angle',
    pointCameraSo: 'Point the camera so that any brand name, logo, or material symbol is clearly visible.',
    cameraDetectionTroubleshooting: 'Camera & detection troubleshooting',
    ifAIHavingTrouble: 'If the AI is having trouble identifying your item, try these steps:',
    stillHavingTrouble: 'Still having trouble? Try scanning in a different environment or under different lighting conditions.',
  },

  fil: {
    // TAGALOG/FILIPINO TRANSLATIONS
    dashboard: 'Dashboard',
    history: 'Kasaysayan',
    tipsAndFacts: 'Mga Tips at Katotohanan',
    settings: 'Mga Setting',
    notifications: 'Mga Notipikasyon',
    youreAllCaughtUp: 'Nakasabay ka na sa lahat!',
    markAllRead: 'Markahan ang lahat bilang nabasa',
    clearAll: 'I-clear ang lahat',

    welcomeBack: 'Maligayang pagbalik',
    ecoWarrior: 'Eco-Warrior',
    startScanning: 'Magsimulang mag-scan ng mga item upang subaybayan ang iyong sustainability journey.',
    scanNewItem: 'I-scan ang bagong item',
    scanNewItemLong: 'Magsimulang mag-scan ng mga item upang subaybayan ang iyong recycling journey.',
    aboutUs: 'Tungkol sa Amin',
    contactUs: 'Makipag-ugnayan sa Amin',
    privacyPolicy: 'Patakaran sa Privacy',
    termsOfUse: 'Mga Tuntunin ng Paggamit',
    
    totalScans: 'Kabuuang Scans',
    noScansYet: 'Walang scans pa',
    getStarted: 'Magsimula na!',
    itemsRecycled: 'Mga Recycled Items',
    recyclingRate: 'Recycling Rate',
    buildYourRate: 'Mag-scan upang bumuo ng iyong rate',
    wasteDiverted: 'Waste na Dine-divert',
    yourImpactStartsHere: 'Nagsisimula dito ang iyong impact',

    openCamera: 'Buksan ang Camera',
    uploadImage: 'I-upload ang Larawan',
    capturePhoto: 'I-capture ang Larawan',
    close: 'Isara',
    analyzeItem: 'Suriin ang Item',
    retake: 'Kumuha Ulit',
    chooseDifferent: 'Pumili ng Iba',
    analyzing: 'Sinusuri...',
    analyzeThisMayTake: 'Sinusuri... Maaaring tumagal ito dahil sa API rate limits.',
    scanComplete: 'Kumpleto ang Scan',

    recyclable: 'Recyclable',
    biodegradable: 'Biodegradable',
    hazardous: 'Makabuluhan',
    eWaste: 'E-Waste',
    
    profile: 'Profil',
    security: 'Account & Seguridad',
    appearance: 'Hitsura',
    language: 'Wika',
    logout: 'Mag-logout',

    account: 'Account',
    preferences: 'Mga Preference',
    app: 'Aplikasyon',
    support: 'Suporta',
    aboutEcoSnap: 'Tungkol sa EcoSnap',

    // Add more Filipino translations as needed
    firstName: 'Unang Pangalan',
    lastName: 'Apelyido',
    bio: 'Buhay',
    username: 'Username',
    email: 'Email',
    password: 'Password',
    changePhoto: 'Baguhin ang Larawan',
    editProfile: 'I-edit ang Profil',
    saveChanges: 'Iligtas ang mga Pagbabago',
    cancel: 'Kanselahin',
    updatePassword: 'I-update ang Password',
    deleteAccount: 'Tanggalin ang Account',
    dangerZone: 'Danger Zone',

    // Theme
    theme: 'Tema',
    light: 'Maliwanag',
    dark: 'Madilim',
    system: 'Sistema',

    // Settings panels
    languageRegion: 'Wika & Rehiyon',
    region: 'Rehiyon',
    timeZone: 'Time Zone',
    dateFormat: 'Format ng Petsa',
    savePreferences: 'Iligtas ang Mga Preference',

    submitting: 'Nagpapadala…',
    updating: 'Nag-a-update…',
    deleting: 'Nag-delete…',
    saving: 'Nagsasave…',

    // Feedback
    submitFeedback: 'Ipadala ang Feedback',
    general: 'Pangkalahatan',
    performance: 'Pagganap',
    other: 'Iba',

    // Messages
    profileUpdatedSuccessfully: 'Matagumpay na na-update ang profil!',
    preferencesSavedSuccessfully: 'Matagumpay na nakatipid ang mga preference!',
    failedToSave: 'Nabigong i-save ang profil.',
  },

  es: {
    // SPANISH TRANSLATIONS
    dashboard: 'Panel de Control',
    history: 'Historial',
    tipsAndFacts: 'Consejos y Hechos',
    settings: 'Configuración',
    notifications: 'Notificaciones',
    youreAllCaughtUp: '¡Estás al día!',
    markAllRead: 'Marcar todo como leído',
    clearAll: 'Borrar todo',

    welcomeBack: 'Bienvenido de vuelta',
    ecoWarrior: 'Eco-Guerrero',
    startScanning: 'Comienza a escanear artículos para rastrear tu viaje de reciclaje.',
    scanNewItem: 'Escanear nuevo artículo',
    aboutUs: 'Sobre Nosotros',
    contactUs: 'Contáctanos',
    privacyPolicy: 'Política de Privacidad',
    termsOfUse: 'Términos de Uso',

    totalScans: 'Escaneos Totales',
    noScansYet: 'Sin escaneos aún',
    getStarted: '¡Empezar!',
    itemsRecycled: 'Artículos Reciclados',
    recyclingRate: 'Tasa de Reciclaje',
    wasteDiverted: 'Residuos Desviados',

    openCamera: 'Abrir Cámara',
    uploadImage: 'Subir Imagen',
    capturePhoto: 'Capturar Foto',
    close: 'Cerrar',
    analyzeItem: 'Analizar Artículo',
    retake: 'Retomar',
    chooseDifferent: 'Elegir Diferente',
    analyzing: 'Analizando...',

    recyclable: 'Reciclable',
    biodegradable: 'Biodegradable',
    hazardous: 'Peligroso',
    eWaste: 'Residuos Electrónicos',

    profile: 'Perfil',
    security: 'Cuenta y Seguridad',
    appearance: 'Apariencia',
    language: 'Idioma',
    logout: 'Cerrar Sesión',

    account: 'Cuenta',
    preferences: 'Preferencias',
    app: 'Aplicación',
    support: 'Soporte',
    aboutEcoSnap: 'Acerca de EcoSnap',

    firstName: 'Nombre de Pila',
    lastName: 'Apellido',
    bio: 'Biografía',
    username: 'Nombre de Usuario',
    email: 'Correo Electrónico',
    password: 'Contraseña',
    changePhoto: 'Cambiar Foto',
    editProfile: 'Editar Perfil',
    saveChanges: 'Guardar Cambios',
    cancel: 'Cancelar',
    updatePassword: 'Actualizar Contraseña',
    deleteAccount: 'Eliminar Cuenta',
    dangerZone: 'Zona de Peligro',

    theme: 'Tema',
    light: 'Claro',
    dark: 'Oscuro',
    system: 'Sistema',

    languageRegion: 'Idioma y Región',
    region: 'Región',
    timeZone: 'Zona Horaria',
    dateFormat: 'Formato de Fecha',
    savePreferences: 'Guardar Preferencias',

    submitting: 'Enviando…',
    updating: 'Actualizando…',
    deleting: 'Eliminando…',
    saving: 'Guardando…',

    submitFeedback: 'Enviar Comentarios',
    general: 'General',
    performance: 'Rendimiento',
    other: 'Otro',

    profileUpdatedSuccessfully: '¡Perfil actualizado correctamente!',
    preferencesSavedSuccessfully: '¡Preferencias guardadas correctamente!',
    failedToSave: 'Error al guardar el perfil.',
  },

  ja: {
    // JAPANESE TRANSLATIONS
    dashboard: 'ダッシュボード',
    history: '履歴',
    tipsAndFacts: 'ヒントと事実',
    settings: '設定',
    notifications: '通知',
    youreAllCaughtUp: 'すべて確認しました!',
    markAllRead: 'すべてを既読にする',
    clearAll: 'すべてをクリア',

    welcomeBack: 'おかえりなさい',
    ecoWarrior: 'エコウォーリア',
    startScanning: 'アイテムのスキャンを開始して、リサイクルの旅を追跡します。',
    scanNewItem: '新しいアイテムをスキャン',
    aboutUs: '私たちについて',
    contactUs: 'お問い合わせ',
    privacyPolicy: 'プライバシーポリシー',
    termsOfUse: '利用規約',

    totalScans: 'スキャン合計',
    noScansYet: 'スキャンなし',
    getStarted: '始めましょう!',
    itemsRecycled: 'リサイクルされたアイテム',
    recyclingRate: 'リサイクル率',
    wasteDiverted: '転用されたゴミ',

    openCamera: 'カメラを開く',
    uploadImage: '画像をアップロード',
    capturePhoto: '写真をキャプチャ',
    close: '閉じる',
    analyzeItem: 'アイテムを分析',
    retake: '撮り直す',
    chooseDifferent: '別を選択',
    analyzing: '分析中...',

    recyclable: 'リサイクル可能',
    biodegradable: '生分解性',
    hazardous: '危険',
    eWaste: '電子ゴミ',

    profile: 'プロフィール',
    security: 'アカウントとセキュリティ',
    appearance: '外観',
    language: '言語',
    logout: 'ログアウト',

    account: 'アカウント',
    preferences: '環境設定',
    app: 'アプリケーション',
    support: 'サポート',
    aboutEcoSnap: 'EcoSnapについて',

    firstName: '名',
    lastName: '姓',
    bio: 'バイオ',
    username: 'ユーザー名',
    email: 'メール',
    password: 'パスワード',
    changePhoto: '写真を変更',
    editProfile: 'プロフィールを編集',
    saveChanges: '変更を保存',
    cancel: 'キャンセル',
    updatePassword: 'パスワードを更新',
    deleteAccount: 'アカウントを削除',
    dangerZone: '危険ゾーン',

    theme: 'テーマ',
    light: 'ライト',
    dark: 'ダーク',
    system: 'システム',

    languageRegion: '言語と地域',
    region: '地域',
    timeZone: 'タイムゾーン',
    dateFormat: '日付形式',
    savePreferences: '設定を保存',

    submitting: '送信中…',
    updating: '更新中…',
    deleting: '削除中…',
    saving: '保存中…',

    submitFeedback: 'フィードバックを送信',
    general: '一般',
    performance: 'パフォーマンス',
    other: 'その他',

    profileUpdatedSuccessfully: 'プロフィールが正常に更新されました!',
    preserencesSavedSuccessfully: '設定が正常に保存されました!',
    failedToSave: 'プロフィールの保存に失敗しました。',
  },
};

// ─── Helper Functions ─────────────────────────────────────────────

/**
 * Get the current language from localStorage
 */
export const getLanguage = () => {
  const stored = localStorage.getItem('language');
  if (stored && TRANSLATIONS[stored]) return stored;
  return 'en';
};

/**
 * Set language and persist to localStorage
 */
export const setLanguageAndPersist = (lang) => {
  if (TRANSLATIONS[lang]) {
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    // Emit custom event so all components can listen
    window.dispatchEvent(new CustomEvent('languageChange', { detail: { language: lang } }));
  }
};

/**
 * Translate a key using current language
 * @param {string} key - Translation key
 * @param {string} lang - Optional language override
 * @returns {string} Translated text or key if not found
 */
export const t = (key, lang = null) => {
  const currentLang = lang || getLanguage();
  const translated = TRANSLATIONS[currentLang]?.[key];
  
  // Fallback to English if key not found
  if (!translated) {
    return TRANSLATIONS['en']?.[key] || key;
  }
  
  return translated;
};

/**
 * Get all available languages
 */
export const getAvailableLanguages = () => [
  { code: 'en', name: 'English (US)', nativeName: 'English' },
  { code: 'fil', name: 'Filipino (Tagalog)', nativeName: 'Tagalog' },
  { code: 'es', name: 'Español', nativeName: 'Español' },
  { code: 'ja', name: '日本語', nativeName: '日本語' },
];

/**
 * Hook to listen to language changes across the app
 */
export const useLanguageListener = (callback) => {
  if (typeof window !== 'undefined') {
    window.addEventListener('languageChange', (e) => {
      callback(e.detail.language);
    });
  }
};

export default TRANSLATIONS;