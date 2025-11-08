import { Language } from './types.ts';

type TranslationKeys = {
    // A-Z
    accessibilityDisplay: string;
    accessDenied: string;
    aiAssistant: string;
    all: string;
    allIraq: string;
    analyzeImage: string;
    analyzeImageDesc: string;
    apiAccess: string;
    apiAccessDesc: string;
    apiConfig: string;
    apiConfigDesc: string;
    appName: string;
    approvedCandidates: string;
    articles: string;
    ask: string;
    askAnything: string;
    askNeighbor: string;
    askNeighborDesc: string;
    askNeighborPlaceholder: string;
    aspectRatio: string;
    attachEvidence: string;
    avatarUrl: string;
    avatarUrlPlaceholder: string;
    back: string;
    backToTools: string;
    biography: string;
    boostedPost: string;
    browseReports: string;
    cancel: string;
    candidateDescription: string;
    candidateEnrichment: string;
    candidateEnrichmentDesc: string;
    candidateHub: string;
    candidateHubDesc: string;
    candidates: string;
    category: string;
    checkVerification: string;
    clearSelection: string;
    colorTheme: string;
    comment: string;
    confidentialNotice: string;
    confirmationId: string;
    contactMP: string;
    contactMPDesc: string;
    contactMPPlaceholder: string;
    contactValidation: string;
    contactValidationDesc: string;
    create: string;
    createAccount: string;
    createNewDiscussion: string;
    createNewDiscussionTitle: string;
    dashboard: string;
    dashboardSubtitle: string;
    dataCollection: string;
    dataCollectionDesc: string;
    dataManagement: string;
    dataManagementDesc: string;
    days: string;
    debates: string;
    didNotReceiveEmail: string;
    discoverCandidates: string;
    discoverCandidatesDesc: string;
    discussionsInLang: string;
    dob: string;
    downloadImage: string;
    downloadReports: string;
    downloadReportsDesc: string;
    downloadQr: string;
    downloadQrFailed: string;
    draftSaved: string;
    editImage: string;
    editImageDesc: string;
    editProfile: string;
    electionCandidates: string;
    electionCountdownTitle: string;
    electionDashboard: string;
    electionData: string;
    electionDataBig: string;
    electionDataDesc: string;
    electionPortal: string;
    electionTimeline: string;
    electionYear: string;
    emailAddress: string;
    emailNotVerified: string;
    emailResent: string;
    empoweringWomenInPolitics: string;
    endSession: string;
    enterTopicForAI: string;
    events: string;
    expectedTurnout: string;
    featureComingSoon: string;
    female: string;
    filterByCandidate: string;
    firstMessage: string;
    firstMessagePlaceholder: string;
    follow: string;
    following: string;
    friends: string;
    fullName: string;
    fullNameNationalId: string;
    gender: string;
    generate: string;
    generateImage: string;
    generateImageDesc: string;
    generateVideoFromImage: string;
    generateVideoFromImageDesc: string;
    generateVideoFromText: string;
    generateVideoFromTextDesc: string;
    generating: string;
    geminiTools: string;
    geminiToolsDesc: string;
    getSuggestion: string;
    governorate: string;
    governorateStats: string;
    highContrast: string;
    highContrastDesc: string;
    home: string;
    hours: string;
    iAmCandidate: string;
    iAmVoter: string;
    ihecUpdates: string;
    imagePromptPlaceholder: string;
    integrityHubTitle: string;
    integrityHubDesc: string;
    intlPortalTitle: string;
    intlPortalDesc: string;
    iraqiElections: string;
    joinLiveDebate: string;
    largeText: string;
    largeTextDesc: string;
    lawCompliance: string;
    lawComplianceDesc: string;
    like: string;
    link: string;
    liveConversation: string;
    liveConversationDesc: string;
    loading: string;
    loadingCandidates: string;
    loadingPosts: string;
    loadingStories: string;
    loginToCandidatePortal: string;
    loginToVoterPortal: string;
    mainDashboard: string;
    mainDashboardDesc: string;
    mainLanguage: string;
    male: string;
    messageSent: string;
    minutes: string;
    myPosts: string;
    myProfile: string;
    myWall: string;
    name: string;
    nationalId: string;
    nationalIdHint: string;
    networkError: string;
    noBio: string;
    noCandidatesFoundQR: string;
    noCandidatesToShow: string;
    noDebatesFound: string;
    noDiscussionsFound: string;
    noEventsScheduled: string;
    noPostsFound: string;
    noPostsYet: string;
    noPostsYetCandidate: string;
    noPostsYetUser: string;
    noReelsFound: string;
    noStories: string;
    notACandidate: string;
    notifications: string;
    observerHub: string;
    observerHubDesc: string;
    observerResources: string;
    observerResourcesDesc: string;
    orContinueWithEmail: string;
    party: string;
    platformRules: string;
    portal: string;
    post: string;
    posts: string;
    postsBy: string; // e.g. "Posts by {name}"
    preview: string;
    previewingPost: string;
    privacy: string;
    private: string;
    promoTools: string;
    promoToolsDesc: string;
    promptTopic: string;
    public: string;
    qualityAnalytics: string;
    qualityAnalyticsDesc: string;
    refineWithAI: string;
    registerAnotherVoter: string;
    registerAsCandidate: string;
    registerAsVoter: string;
    registerButton: string;
    registerOrg: string;
    registrationFailed: string;
    registrationSuccess: string;
    relevantLocations: string;
    reportDetails: string;
    reportPost: string;
    reportType: string;
    reportTypes: {
        buying_votes: string;
        propaganda_violation: string;
        voter_intimidation: string;
        misinformation: string;
        other: string;
    };
    requestApiAccess: string;
    resendVerificationEmail: string;
    resources: string;
    results: string;
    rsvp: string;
    rule1: string;
    rule2: string;
    rule3: string;
    rule4: string;
    saveChanges: string;
    saveDraft: string;
    scanToSee: string;
    search: string;
    seconds: string;
    selectGovernorate: string;
    selectReportType: string;
    selectYourGovernorate: string;
    sendMessage: string;
    serious: string;
    setReminder: string;
    settings: string;
    share: string;
    shareLinkCopied: string;
    shareNotSupported: string;
    showOriginal: string;
    showTranslation: string;
    signInWithFacebook: string;
    signInWithGoogle: string;
    simulationNotice: string;
    social: string;
    socialConnections: string;
    socialConnectionsDesc: string;
    socialLoginFailed: string;
    sources: string;
    status: {
        active: string;
        medium: string;
    };
    submissionError: string;
    submissionSuccess: string;
    submissionThanks: string;
    submitNewReport: string;
    submitReport: string;
    submitting: string;
    supportResources: string;
    supportResourcesDesc: string;
    table: {
        governorate: string;
        turnout: string;
        status: string;
    };
    teaHouse: string;
    timeline: {
        voterRegistration: string;
        candidateDeadline: string;
        campaignPeriod: string;
        electionDay: string;
    };
    topicTitle: string;
    topicTitlePlaceholder: string;
    totalVoters: string;
    trackingId: string;
    translating: string;
    tts: string;
    ttsDesc: string;
    typeAMessage: string;
    underConstruction: string;
    unlink: string;
    upcomingEvents: string;
    verificationSentMessage: string;
    verifyYourEmail: string;

    viewProfile: string;
    violationDesc: string;
    violationDescPlaceholder: string;
    voterCenter: string;
    voterCenterDesc: string;
    voterDescription: string;
    voterInfo: string;
    voterRegistrationTitle: string;
    voterRegistrationDesc: string;
    welcomeToApp: string; // e.g. "Welcome to {appName}"
    whatsOnYourMind: string;
    whoToFollow: string;
    womenCandidates: string;
    you: string;
    reels: string;
};

const en: TranslationKeys = {
    accessibilityDisplay: 'Accessibility & Display',
    accessDenied: 'Access Denied. You do not have permission to view this page.',
    aiAssistant: 'AI Assistant',
    all: 'All',
    allIraq: 'All of Iraq',
    analyzeImage: 'Analyze Image',
    analyzeImageDesc: 'Get AI-powered insights from any image.',
    apiAccess: 'API Access',
    apiAccessDesc: 'Access our election data API for research and analysis. Get real-time updates on candidates, parties, and voter sentiment.',
    apiConfig: 'API Config',
    apiConfigDesc: 'Manage connections to social media APIs.',
    appName: 'Smart Campaign',
    approvedCandidates: 'Approved Candidates',
    articles: 'Articles',
    ask: 'Ask',
    askAnything: 'Ask anything...',
    askNeighbor: 'Ask Neighbor',
    askNeighborDesc: 'Get local information and recommendations powered by Google Maps.',
    askNeighborPlaceholder: 'e.g., "Where can I find the best kunafa near me?"',
    aspectRatio: 'Aspect Ratio',
    attachEvidence: 'Attach Evidence (Optional)',
    avatarUrl: 'Avatar URL',
    avatarUrlPlaceholder: 'https://...',
    back: 'Back',
    backToTools: 'Back to Tools',
    biography: 'Biography',
    boostedPost: 'Boosted Post',
    browseReports: 'Browse Reports',
    cancel: 'Cancel',
    candidateDescription: 'Register as a candidate to manage your profile, post updates, and engage with voters.',
    candidateEnrichment: 'Enrichment',
    candidateEnrichmentDesc: 'View AI-enriched candidate profiles.',
    candidateHub: 'Candidate Hub',
    candidateHubDesc: 'Manage your campaign, analyze data, and connect with supporters. Tools for modern political outreach.',
    candidates: 'Candidates',
    category: 'Category',
    checkVerification: 'I\'ve Verified My Email',
    clearSelection: 'Clear Selection',
    colorTheme: 'Color Theme',
    comment: 'Comment',
    confidentialNotice: 'Your report is anonymous and confidential. Your identity will not be shared.',
    confirmationId: 'Your Confirmation ID',
    contactMP: 'Contact Your Representative',
    contactMPDesc: 'As an elected official, this candidate is now your representative. Send them a message directly.',
    contactMPPlaceholder: 'Write your message, question, or concern here...',
    contactValidation: 'Validation',
    contactValidationDesc: 'Review and verify collected contact info.',
    create: 'Create',
    createAccount: 'Create Account',
    createNewDiscussion: 'Start a New Discussion',
    createNewDiscussionTitle: 'Create a New Discussion Topic',
    dashboard: 'Dashboard',
    dashboardSubtitle: 'Your central hub for monitoring election integrity and data.',
    dataCollection: 'Collection',
    dataCollectionDesc: 'Monitor the automated data scraping process.',
    dataManagement: 'Data Management Suite',
    dataManagementDesc: 'Tools for collecting, validating, and analyzing candidate data.',
    days: 'Days',
    debates: 'Debates',
    didNotReceiveEmail: 'Didn\'t receive an email?',
    discoverCandidates: 'Discover Candidates',
    discoverCandidatesDesc: 'Below are the candidates matching the QR code you scanned. Tap on a profile to learn more on the official campaign app.',
    discussionsInLang: 'Join discussions in your preferred language.',
    dob: 'Date of Birth',
    downloadImage: 'Download Image',
    downloadReports: 'Download Reports',
    downloadReportsDesc: 'Access detailed reports and datasets on election activities, voter turnout, and integrity incidents.',
    downloadQr: 'Download QR Code',
    downloadQrFailed: 'Failed to download QR code.',
    draftSaved: 'Draft saved!',
    editImage: 'Edit Image',
    editImageDesc: 'Modify images with simple text prompts.',
    editProfile: 'Edit Profile',
    electionCandidates: 'Candidates',
    electionCountdownTitle: 'Election Countdown',
    electionDashboard: 'Election Integrity Dashboard',
    electionData: 'Data',
    electionDataBig: 'Election Data',
    electionDataDesc: 'Analyze trends and compare candidates.',
    electionPortal: 'Election Portal',
    electionTimeline: 'Key Election Timeline',
    electionYear: '2025',
    emailAddress: 'Email Address',
    emailNotVerified: 'Your email is not yet verified. Please check your inbox.',
    emailResent: 'Verification email has been resent.',
    empoweringWomenInPolitics: 'Empowering women in Iraqi politics. Explore the profiles of female candidates running for office.',
    endSession: 'End Session',
    enterTopicForAI: 'Enter topic for AI suggestion...',
    events: 'Events',
    expectedTurnout: 'Expected Turnout',
    featureComingSoon: 'This feature is coming soon!',
    female: 'Female',
    filterByCandidate: 'Filter by candidate...',
    firstMessage: 'First Message',
    firstMessagePlaceholder: 'Start the conversation with your first message...',
    follow: 'Follow',
    following: 'Following',
    friends: 'Friends',
    fullName: 'Full Name',
    fullNameNationalId: 'Full Name (as on National ID)',
    gender: 'Gender',
    generate: 'Generate',
    generateImage: 'Generate Image',
    generateImageDesc: 'Create unique images from text descriptions.',
    generateVideoFromImage: 'Video from Image',
    generateVideoFromImageDesc: 'Animate a starting image with a prompt.',
    generateVideoFromText: 'Video from Text',
    generateVideoFromTextDesc: 'Generate a short video from a text prompt.',
    generating: 'Generating...',
    geminiTools: 'Gemini Tools',
    geminiToolsDesc: 'Explore powerful AI features powered by Google Gemini.',
    getSuggestion: 'Get Suggestion',
    governorate: 'Governorate',
    governorateStats: 'Governorate Statistics',
    highContrast: 'High Contrast Mode',
    highContrastDesc: 'Increase text and UI element contrast.',
    home: 'Home',
    hours: 'Hours',
    iAmCandidate: 'I am a Candidate or Campaign Manager',
    iAmVoter: 'I am a Voter',
    ihecUpdates: 'IHEC Updates',
    imagePromptPlaceholder: 'e.g., "A hyperrealistic photo of a modern Baghdad skyline at sunset"',
    integrityHubTitle: 'Election Integrity Hub',
    integrityHubDesc: 'Report violations and help ensure a fair election process. All submissions are reviewed by IHEC officials.',
    intlPortalTitle: 'International & Observer Portal',
    intlPortalDesc: 'Resources for international observers, researchers, and media.',
    iraqiElections: 'Iraqi Elections',
    joinLiveDebate: 'Join Live Debate',
    largeText: 'Large Text',
    largeTextDesc: 'Increase the font size across the app.',
    lawCompliance: 'Law & Compliance',
    lawComplianceDesc: 'Access legal frameworks and regulations.',
    like: 'Like',
    link: 'Link',
    liveConversation: 'Live Conversation',
    liveConversationDesc: 'Have a real-time voice chat with Gemini.',
    loading: 'Loading...',
    loadingCandidates: 'Loading Candidates...',
    loadingPosts: 'Loading posts...',
    loadingStories: 'Loading stories...',
    loginToCandidatePortal: 'Login to Candidate Portal',
    loginToVoterPortal: 'Login to Voter Portal',
    mainDashboard: 'Main Dashboard',
    mainDashboardDesc: 'Access key portals and tools for the election process.',
    mainLanguage: 'Main Language',
    male: 'Male',
    messageSent: 'Message sent successfully!',
    minutes: 'Mins',
    myPosts: 'My Posts',
    myProfile: 'My Profile',
    myWall: 'My Wall',
    name: 'Name',
    nationalId: 'National ID Number',
    nationalIdHint: 'Your 12-digit National ID number.',
    networkError: 'A network error occurred. Please check your connection and try again.',
    noBio: 'No biography provided.',
    noCandidatesFoundQR: 'No candidates found for the specified party and governorate.',
    noCandidatesToShow: 'No candidates to show.',
    noDebatesFound: 'No debates found for the selected filters.',
    noDiscussionsFound: 'No discussions yet. Be the first to start one!',
    noEventsScheduled: 'No upcoming events scheduled for these filters.',
    noPostsFound: 'No posts found. Try adjusting your filters.',
    noPostsYet: 'You have not made any posts yet.',
    noPostsYetCandidate: 'This candidate has not made any posts yet.',
    noPostsYetUser: 'You haven\'t posted anything yet.',
    noReelsFound: 'No reels found for the selected filters.',
    noStories: 'No stories available for this user.',
    notACandidate: 'This profile does not belong to a candidate.',
    notifications: 'Notifications',
    observerHub: 'Observer Hub',
    observerHubDesc: 'Resources for international observers.',
    observerResources: 'Observer Resources',
    observerResourcesDesc: 'Access accreditation forms, guidelines, and contact information for election observation missions.',
    orContinueWithEmail: 'or continue with email',
    party: 'Party',
    platformRules: 'Platform Rules',
    portal: 'Portal',
    post: 'Post',
    posts: 'Posts',
    postsBy: 'Posts by {name}',
    preview: 'Preview',
    previewingPost: 'Previewing Post',
    privacy: 'Privacy',
    private: 'Private',
    promoTools: 'Promotional Tools',
    promoToolsDesc: 'Share this QR code to let voters in your governorate discover your party\'s candidates.',
    promptTopic: 'Please enter a topic to get a suggestion.',
    public: 'Public',
    qualityAnalytics: 'Analytics',
    qualityAnalyticsDesc: 'Visualize data quality and completeness.',
    refineWithAI: 'Refine with AI',
    registerAnotherVoter: 'Register Another Voter',
    registerAsCandidate: 'Register as a Candidate',
    registerAsVoter: 'Register as a Voter',
    registerButton: 'Register to Vote',
    registerOrg: 'Register Your Organization',
    registrationFailed: 'Registration failed. Please try again.',
    registrationSuccess: 'Registration Successful!',
    relevantLocations: 'Relevant Locations',
    reportDetails: 'Report Details',
    reportPost: 'Report Post',
    reportType: 'Type of Violation',
    reportTypes: {
        buying_votes: 'Vote Buying or Bribery',
        propaganda_violation: 'Campaign Propaganda Violation',
        voter_intimidation: 'Voter Intimidation or Coercion',
        misinformation: 'Spreading Misinformation/Disinformation',
        other: 'Other',
    },
    requestApiAccess: 'Request API Access',
    resendVerificationEmail: 'Resend',
    resources: 'Resources',
    results: 'Results',
    rsvp: 'RSVP',
    rule1: 'Be respectful.',
    rule2: 'No hate speech.',
    rule3: 'Stay on topic.',
    rule4: 'Verify information.',
    saveChanges: 'Save Changes',
    saveDraft: 'Save Draft',
    scanToSee: 'Scan to see our candidates!',
    search: 'Search',
    seconds: 'Secs',
    selectGovernorate: 'Select Governorate',
    selectReportType: 'Select report type...',
    selectYourGovernorate: 'Select your governorate...',
    sendMessage: 'Send Message',
    serious: 'Election',
    setReminder: 'Set Reminder',
    settings: 'Settings',
    share: 'Share',
    shareLinkCopied: 'Link copied to clipboard!',
    shareNotSupported: 'Web Share API not supported in your browser.',
    showOriginal: 'Show Original',
    showTranslation: 'Show Translation',
    signInWithFacebook: 'Sign in with Facebook',
    signInWithGoogle: 'Sign in with Google',
    simulationNotice: 'This is a simulation. Your data will not be stored or used for official registration.',
    social: 'Social',
    socialConnections: 'Social Media Connections',
    socialConnectionsDesc: 'Link your social media accounts to enable cross-platform posting and analytics.',
    socialLoginFailed: 'Social login failed. Please try again.',
    sources: 'Sources',
    status: {
        active: 'Active',
        medium: 'Medium',
    },
    submissionError: 'Submission failed. Please try again.',
    submissionSuccess: 'Report Submitted Successfully!',
    submissionThanks: 'Thank you for your contribution to election integrity.',
    submitNewReport: 'Submit Another Report',
    submitReport: 'Submit Report',
    submitting: 'Submitting...',
    supportResources: 'Support & Resources',
    supportResourcesDesc: 'Find help and important information.',
    table: {
        governorate: 'Governorate',
        turnout: 'Est. Turnout',
        status: 'Status',
    },
    teaHouse: 'Tea House',
    timeline: {
        voterRegistration: 'Voter Registration Opens',
        candidateDeadline: 'Candidate Application Deadline',
        campaignPeriod: 'Official Campaign Period Begins',
        electionDay: 'Election Day',
    },
    topicTitle: 'Topic Title',
    topicTitlePlaceholder: 'What is the main subject of your discussion?',
    totalVoters: 'Total Registered Voters',
    trackingId: 'Your Tracking ID',
    translating: 'Translating...',
    tts: 'Text-to-Speech',
    ttsDesc: 'Enable audio narration for posts and articles.',
    typeAMessage: 'Type a message...',
    underConstruction: 'Under Construction',
    unlink: 'Unlink',
    upcomingEvents: 'Upcoming Events',
    verificationSentMessage: 'We\'ve sent a verification link to your email. Please click the link to continue.',
    verifyYourEmail: 'Verify Your Email',
    viewProfile: 'View Profile',
    violationDesc: 'Description of Violation',
    violationDescPlaceholder: 'Please provide as much detail as possible, including date, time, location, and individuals involved.',
    voterCenter: 'Voter Center',
    voterCenterDesc: 'Register to vote, check your status, and find your polling station. Your voice matters.',
    voterDescription: 'Join the conversation, follow candidates, and stay informed about the election.',
    voterInfo: 'Voter Information',
    voterRegistrationTitle: 'Voter Registration',
    voterRegistrationDesc: 'Ensure your voice is heard. Register to vote in the upcoming election.',
    welcomeToApp: 'Welcome to {appName}',
    whatsOnYourMind: 'What\'s on your mind?',
    whoToFollow: 'Who to Follow',
    womenCandidates: 'Women Candidates',
    you: 'You',
    reels: 'Reels',
};

const ar: TranslationKeys = {
    accessibilityDisplay: 'الوصول والعرض',
    accessDenied: 'تم رفض الوصول. ليس لديك إذن لعرض هذه الصفحة.',
    aiAssistant: 'المساعد الذكي',
    all: 'الكل',
    allIraq: 'كل العراق',
    analyzeImage: 'تحليل صورة',
    analyzeImageDesc: 'احصل على رؤى مدعومة بالذكاء الاصطناعي من أي صورة.',
    apiAccess: 'الوصول إلى API',
    apiAccessDesc: 'الوصول إلى واجهة برمجة تطبيقات بيانات الانتخابات الخاصة بنا للبحث والتحليل. احصل على تحديثات في الوقت الفعلي عن المرشحين والأحزاب ومشاعر الناخبين.',
    apiConfig: 'إعدادات API',
    apiConfigDesc: 'إدارة الاتصالات بواجهات برمجة تطبيقات الوسائط الاجتماعية.',
    appName: 'الحملة الذكية',
    approvedCandidates: 'المرشحون المعتمدون',
    articles: 'مقالات',
    ask: 'اسأل',
    askAnything: 'اسأل أي شيء...',
    askNeighbor: 'اسأل جارك',
    askNeighborDesc: 'احصل على معلومات وتوصيات محلية مدعومة بخرائط جوجل.',
    askNeighborPlaceholder: 'مثال: "أين أجد أفضل كنافة بالقرب مني؟"',
    aspectRatio: 'نسبة العرض إلى الارتفاع',
    attachEvidence: 'إرفاق دليل (اختياري)',
    avatarUrl: 'رابط الصورة الرمزية',
    avatarUrlPlaceholder: 'https://...',
    back: 'رجوع',
    backToTools: 'العودة إلى الأدوات',
    biography: 'السيرة الذاتية',
    boostedPost: 'منشور مموّل',
    browseReports: 'تصفح التقارير',
    cancel: 'إلغاء',
    candidateDescription: 'سجل كمرشح لإدارة ملفك الشخصي ونشر التحديثات والتفاعل مع الناخبين.',
    candidateEnrichment: 'إثراء البيانات',
    candidateEnrichmentDesc: 'عرض ملفات المرشحين المثرية بالذكاء الاصطناعي.',
    candidateHub: 'مركز المرشح',
    candidateHubDesc: 'أدر حملتك، وحلل البيانات، وتواصل مع المؤيدين. أدوات للتواصل السياسي الحديث.',
    candidates: 'المرشحون',
    category: 'الفئة',
    checkVerification: 'لقد قمت بتأكيد بريدي الإلكتروني',
    clearSelection: 'مسح الاختيار',
    colorTheme: 'سمة اللون',
    comment: 'تعليق',
    confidentialNotice: 'بلاغك مجهول وسري. لن يتم مشاركة هويتك.',
    confirmationId: 'معرف التأكيد الخاص بك',
    contactMP: 'تواصل مع نائك',
    contactMPDesc: 'بصفته مسؤولاً منتخبًا، أصبح هذا المرشح الآن ممثلك. أرسل له رسالة مباشرة.',
    contactMPPlaceholder: 'اكتب رسالتك أو سؤالك أو استفسارك هنا...',
    contactValidation: 'التحقق',
    contactValidationDesc: 'مراجعة والتحقق من معلومات الاتصال التي تم جمعها.',
    create: 'إنشاء',
    createAccount: 'إنشاء حساب',
    createNewDiscussion: 'ابدأ نقاشًا جديدًا',
    createNewDiscussionTitle: 'إنشاء موضوع نقاش جديد',
    dashboard: 'لوحة التحكم',
    dashboardSubtitle: 'مركزك الرئيسي لمراقبة نزاهة الانتخابات والبيانات.',
    dataCollection: 'الجمع',
    dataCollectionDesc: 'مراقبة عملية جمع البيانات الآلية.',
    dataManagement: 'مجموعة إدارة البيانات',
    dataManagementDesc: 'أدوات لجمع بيانات المرشحين والتحقق منها وتحليلها.',
    days: 'أيام',
    debates: 'مناظرات',
    didNotReceiveEmail: 'لم تستلم البريد الإلكتروني؟',
    discoverCandidates: 'اكتشف المرشحين',
    discoverCandidatesDesc: 'فيما يلي المرشحون المطابقون لرمز الاستجابة السريعة الذي قمت بمسحه. اضغط على الملف الشخصي لمعرفة المزيد على تطبيق الحملة الرسمي.',
    discussionsInLang: 'انضم إلى النقاشات بلغتك المفضلة.',
    dob: 'تاريخ الميلاد',
    downloadImage: 'تنزيل الصورة',
    downloadReports: 'تنزيل التقارير',
    downloadReportsDesc: 'الوصول إلى تقارير ومجموعات بيانات مفصلة عن الأنشطة الانتخابية ومشاركة الناخبين وحوادث النزاهة.',
    downloadQr: 'تنزيل رمز QR',
    downloadQrFailed: 'فشل تنزيل رمز الاستجابة السريعة.',
    draftSaved: 'تم حفظ المسودة!',
    editImage: 'تعديل صورة',
    editImageDesc: 'تعديل الصور باستخدام أوامر نصية بسيطة.',
    editProfile: 'تعديل الملف الشخصي',
    electionCandidates: 'المرشحون',
    electionCountdownTitle: 'العد التنازلي للانتخابات',
    electionDashboard: 'لوحة معلومات نزاهة الانتخابات',
    electionData: 'بيانات',
    electionDataBig: 'بيانات الانتخابات',
    electionDataDesc: 'حلل الاتجاهات وقارن بين المرشحين.',
    electionPortal: 'بوابة الانتخابات',
    electionTimeline: 'الجدول الزمني الرئيسي للانتخابات',
    electionYear: '٢٠٢٥',
    emailAddress: 'البريد الإلكتروني',
    emailNotVerified: 'لم يتم التحقق من بريدك الإلكتروني بعد. يرجى مراجعة بريدك الوارد.',
    emailResent: 'تم إعادة إرسال بريد التحقق.',
    empoweringWomenInPolitics: 'تمكين المرأة في السياسة العراقية. استكشف ملفات المرشحات للانتخابات.',
    endSession: 'إنهاء الجلسة',
    enterTopicForAI: 'أدخل موضوعًا لاقتراح الذكاء الاصطناعي...',
    events: 'فعاليات',
    expectedTurnout: 'المشاركة المتوقعة',
    featureComingSoon: 'هذه الميزة ستتوفر قريباً!',
    female: 'أنثى',
    filterByCandidate: 'تصفية حسب المرشح...',
    firstMessage: 'الرسالة الأولى',
    firstMessagePlaceholder: 'ابدأ المحادثة برسالتك الأولى...',
    follow: 'متابعة',
    following: 'تتابع',
    friends: 'الأصدقاء',
    fullName: 'الاسم الكامل',
    fullNameNationalId: 'الاسم الكامل (كما في البطاقة الوطنية)',
    gender: 'الجنس',
    generate: 'إنشاء',
    generateImage: 'إنشاء صورة',
    generateImageDesc: 'أنشئ صورًا فريدة من الأوصاف النصية.',
    generateVideoFromImage: 'فيديو من صورة',
    generateVideoFromImageDesc: 'تحريك صورة بداية باستخدام موجه.',
    generateVideoFromText: 'فيديو من نص',
    generateVideoFromTextDesc: 'أنشئ مقطع فيديو قصيرًا من موجه نصي.',
    generating: 'جاري الإنشاء...',
    geminiTools: 'أدوات Gemini',
    geminiToolsDesc: 'استكشف ميزات الذكاء الاصطناعي القوية المدعومة من Google Gemini.',
    getSuggestion: 'احصل على اقتراح',
    governorate: 'المحافظة',
    governorateStats: 'إحصائيات المحافظات',
    highContrast: 'وضع التباين العالي',
    highContrastDesc: 'زيادة تباين النصوص وعناصر الواجهة.',
    home: 'الرئيسية',
    hours: 'ساعات',
    iAmCandidate: 'أنا مرشح أو مدير حملة',
    iAmVoter: 'أنا ناخب',
    ihecUpdates: 'تحديثات المفوضية',
    imagePromptPlaceholder: 'مثال: "صورة واقعية جدًا لأفق بغداد الحديث عند غروب الشمس"',
    integrityHubTitle: 'مركز نزاهة الانتخابات',
    integrityHubDesc: 'أبلغ عن الانتهاكات وساعد في ضمان عملية انتخابية نزيهة. تتم مراجعة جميع الطلبات من قبل مسؤولي المفوضية العليا المستقلة للانتخابات.',
    intlPortalTitle: 'البوابة الدولية والمراقبين',
    intlPortalDesc: 'موارد للمراقبين الدوليين والباحثين ووسائل الإعلام.',
    iraqiElections: 'الانتخابات العراقية',
    joinLiveDebate: 'انضم إلى المناظرة المباشرة',
    largeText: 'نص كبير',
    largeTextDesc: 'زيادة حجم الخط في التطبيق.',
    lawCompliance: 'القانون والامتثال',
    lawComplianceDesc: 'الوصول إلى الأطر واللوائح القانونية.',
    like: 'إعجاب',
    link: 'ربط',
    liveConversation: 'محادثة مباشرة',
    liveConversationDesc: 'أجرِ محادثة صوتية في الوقت الفعلي مع Gemini.',
    loading: 'جاري التحميل...',
    loadingCandidates: 'جاري تحميل المرشحين...',
    loadingPosts: 'جاري تحميل المنشورات...',
    loadingStories: 'جاري تحميل القصص...',
    loginToCandidatePortal: 'تسجيل الدخول إلى بوابة المرشح',
    loginToVoterPortal: 'تسجيل الدخول إلى بوابة الناخب',
    mainDashboard: 'لوحة التحكم الرئيسية',
    mainDashboardDesc: 'الوصول إلى البوابات والأدوات الرئيسية للعملية الانتخابية.',
    mainLanguage: 'اللغة الرئيسية',
    male: 'ذكر',
    messageSent: 'تم إرسال الرسالة بنجاح!',
    minutes: 'دقائق',
    myPosts: 'منشوراتي',
    myProfile: 'ملفي الشخصي',
    myWall: 'حائطي',
    name: 'الاسم',
    nationalId: 'رقم الهوية الوطنية',
    nationalIdHint: 'رقم هويتك الوطنية المكون من 12 رقمًا.',
    networkError: 'حدث خطأ في الشبكة. يرجى التحقق من اتصالك والمحاولة مرة أخرى.',
    noBio: 'لا توجد سيرة ذاتية.',
    noCandidatesFoundQR: 'لم يتم العثور على مرشحين للحزب والمحافظة المحددين.',
    noCandidatesToShow: 'لا يوجد مرشحون لعرضهم.',
    noDebatesFound: 'لم يتم العثور على مناظرات للمرشحات المحددة.',
    noDiscussionsFound: 'لا توجد نقاشات بعد. كن أول من يبدأ واحدة!',
    noEventsScheduled: 'لا توجد فعاليات قادمة مجدولة لهذه المرشحات.',
    noPostsFound: 'لم يتم العثور على منشورات. حاول تعديل مرشحاتك.',
    noPostsYet: 'لم تقم بأي منشورات بعد.',
    noPostsYetCandidate: 'لم يقم هذا المرشح بأي منشورات بعد.',
    noPostsYetUser: 'لم تنشر أي شيء بعد.',
    noReelsFound: 'لم يتم العثور على مقاطع ريلز للمرشحات المحددة.',
    noStories: 'لا توجد قصص متاحة لهذا المستخدم.',
    notACandidate: 'هذا الملف الشخصي لا ينتمي إلى مرشح.',
    notifications: 'الإشعارات',
    observerHub: 'مركز المراقبين',
    observerHubDesc: 'موارد للمراقبين الدوليين.',
    observerResources: 'موارد المراقبين',
    observerResourcesDesc: 'الوصول إلى استمارات الاعتماد والمبادئ التوجيهية ومعلومات الاتصال لبعثات مراقبة الانتخابات.',
    orContinueWithEmail: 'أو المتابعة بالبريد الإلكتروني',
    party: 'الحزب',
    platformRules: 'قواعد المنصة',
    portal: 'البوابة',
    post: 'نشر',
    posts: 'المنشورات',
    postsBy: 'منشورات {name}',
    preview: 'معاينة',
    previewingPost: 'معاينة المنشور',
    privacy: 'الخصوصية',
    private: 'خاص',
    promoTools: 'أدوات ترويجية',
    promoToolsDesc: 'شارك رمز الاستجابة السريعة هذا لتمكين الناخبين في محافظتك من اكتشاف مرشحي حزبك.',
    promptTopic: 'الرجاء إدخال موضوع للحصول على اقتراح.',
    public: 'عام',
    qualityAnalytics: 'تحليلات',
    qualityAnalyticsDesc: 'تصور جودة البيانات واكتمالها.',
    refineWithAI: 'تحسين بـ AI',
    registerAnotherVoter: 'تسجيل ناخب آخر',
    registerAsCandidate: 'التسجيل كمرشح',
    registerAsVoter: 'التسجيل كناخب',
    registerButton: 'سجل للتصويت',
    registerOrg: 'سجل منظمتك',
    registrationFailed: 'فشل التسجيل. حاول مرة اخرى.',
    registrationSuccess: 'تم التسجيل بنجاح!',
    relevantLocations: 'المواقع ذات الصلة',
    reportDetails: 'تفاصيل البلاغ',
    reportPost: 'الإبلاغ عن المنشور',
    reportType: 'نوع المخالفة',
    reportTypes: {
        buying_votes: 'شراء أصوات أو رشوة',
        propaganda_violation: 'مخالفة الدعاية الانتخابية',
        voter_intimidation: 'تخويف الناخبين أو إكراههم',
        misinformation: 'نشر معلومات مضللة / كاذبة',
        other: 'أخرى',
    },
    requestApiAccess: 'طلب الوصول إلى API',
    resendVerificationEmail: 'إعادة الإرسال',
    resources: 'موارد',
    results: 'النتائج',
    rsvp: 'تسجيل الحضور',
    rule1: 'كن محترماً.',
    rule2: 'لا لخطاب الكراهية.',
    rule3: 'التزم بالموضوع.',
    rule4: 'تحقق من المعلومات.',
    saveChanges: 'حفظ التغييرات',
    saveDraft: 'حفظ كمسودة',
    scanToSee: 'امسح الرمز لرؤية مرشحينا!',
    search: 'بحث',
    seconds: 'ثواني',
    selectGovernorate: 'اختر المحافظة',
    selectReportType: 'اختر نوع البلاغ...',
    selectYourGovernorate: 'اختر محافظتك...',
    sendMessage: 'إرسال رسالة',
    serious: 'انتخابات',
    setReminder: 'ضبط تذكير',
    settings: 'الإعدادات',
    share: 'مشاركة',
    shareLinkCopied: 'تم نسخ الرابط إلى الحافظة!',
    shareNotSupported: 'واجهة برمجة تطبيقات المشاركة عبر الويب غير مدعومة في متصفحك.',
    showOriginal: 'إظهار الأصل',
    showTranslation: 'إظهار الترجمة',
    signInWithFacebook: 'تسجيل الدخول باستخدام فيسبوك',
    signInWithGoogle: 'تسجيل الدخول باستخدام جوجل',
    simulationNotice: 'هذه محاكاة. لن يتم تخزين بياناتك أو استخدامها للتسجيل الرسمي.',
    social: 'تواصل اجتماعي',
    socialConnections: 'اتصالات وسائل التواصل الاجتماعي',
    socialConnectionsDesc: 'اربط حسابات وسائل التواصل الاجتماعي الخاصة بك لتمكين النشر عبر المنصات والتحليلات.',
    socialLoginFailed: 'فشل تسجيل الدخول الاجتماعي. يرجى المحاولة مرة أخرى.',
    sources: 'المصادر',
    status: {
        active: 'نشط',
        medium: 'متوسط',
    },
    submissionError: 'فشل الإرسال. يرجى المحاولة مرة أخرى.',
    submissionSuccess: 'تم تقديم البلاغ بنجاح!',
    submissionThanks: 'شكرًا لمساهمتك في نزاهة الانتخابات.',
    submitNewReport: 'تقديم بلاغ آخر',
    submitReport: 'إرسال البلاغ',
    submitting: 'جاري الإرسال...',
    supportResources: 'الدعم والموارد',
    supportResourcesDesc: 'ابحث عن المساعدة والمعلومات المهمة.',
    table: {
        governorate: 'المحافظة',
        turnout: 'المشاركة المقدرة',
        status: 'الحالة',
    },
    teaHouse: 'المقهى',
    timeline: {
        voterRegistration: 'فتح باب تسجيل الناخبين',
        candidateDeadline: 'الموعد النهائي لتقديم طلبات المرشحين',
        campaignPeriod: 'بدء فترة الدعاية الانتخابية الرسمية',
        electionDay: 'يوم الانتخابات',
    },
    topicTitle: 'عنوان الموضوع',
    topicTitlePlaceholder: 'ما هو الموضوع الرئيسي لنقاشك؟',
    totalVoters: 'إجمالي الناخبين المسجلين',
    trackingId: 'معرف التتبع الخاص بك',
    translating: 'جاري الترجمة...',
    tts: 'تحويل النص إلى كلام',
    ttsDesc: 'تمكين السرد الصوتي للمنشورات والمقالات.',
    typeAMessage: 'اكتب رسالة...',
    underConstruction: 'تحت الإنشاء',
    unlink: 'إلغاء الربط',
    upcomingEvents: 'الفعاليات القادمة',
    verificationSentMessage: 'لقد أرسلنا رابط تحقق إلى بريدك الإلكتروني. يرجى النقر على الرابط للمتابعة.',
    verifyYourEmail: 'تحقق من بريدك الإلكتروني',
    viewProfile: 'عرض الملف الشخصي',
    violationDesc: 'وصف المخالفة',
    violationDescPlaceholder: 'يرجى تقديم أكبر قدر ممكن من التفاصيل، بما في ذلك التاريخ والوقت والموقع والأفراد المتورطين.',
    voterCenter: 'مركز الناخبين',
    voterCenterDesc: 'سجل للتصويت، تحقق من حالتك، وابحث عن مركز الاقتراع الخاص بك. صوتك مهم.',
    voterDescription: 'انضم إلى المحادثة، تابع المرشحين، وابق على اطلاع على الانتخابات.',
    voterInfo: 'معلومات الناخب',
    voterRegistrationTitle: 'تسجيل الناخبين',
    voterRegistrationDesc: 'تأكد من سماع صوتك. سجل للتصويت في الانتخابات القادمة.',
    welcomeToApp: 'أهلاً بك في {appName}',
    whatsOnYourMind: 'بماذا تفكر؟',
    whoToFollow: 'من تتابع',
    womenCandidates: 'المرشحات',
    you: 'أنت',
    reels: 'ريلز',
};

// For simplicity, Kurdish translations will be the same as English for now.
const ku: TranslationKeys = en;

export const UI_TEXT: Record<Language, TranslationKeys> = {
    en,
    ar,
    ku,
};