import { 
  Denomination, 
  DenominationalProfile, 
  BibleTranslation, 
  TeachingApproach,
  ContentGuideline,
  ChristianContentLevel 
} from './types';

// Comprehensive denominational profiles with theological distinctives
export const DENOMINATIONAL_PROFILES: Record<Denomination, DenominationalProfile> = {
  "Reformed": {
    denomination: "Reformed",
    theologicalEmphases: [
      "Sovereignty of God",
      "Total depravity",
      "Unconditional election",
      "Limited atonement",
      "Irresistible grace",
      "Perseverance of saints",
      "Scripture alone (Sola Scriptura)",
      "Grace alone (Sola Gratia)",
      "Faith alone (Sola Fide)"
    ],
    preferredTranslations: ["ESV", "NASB", "NIV"],
    culturalConsiderations: [
      "Emphasis on theological depth",
      "Intellectual approach to faith",
      "Strong emphasis on doctrine",
      "Covenant theology"
    ],
    avoidedTopics: [
      "Works-based salvation",
      "Arminian theology",
      "Pentecostal gifts"
    ],
    preferredApproaches: ["Scripture-centered", "Academic", "Traditional"],
    contentGuidelines: [
      {
        level: 0,
        description: "Secular content with no faith elements",
        examples: ["Standard academic content", "General character education"],
        restrictions: ["No religious references"]
      },
      {
        level: 1,
        description: "General Christian values reflecting Reformed character",
        examples: ["Stewardship", "Diligence", "Truthfulness", "Service to others"],
        restrictions: ["Avoid specific doctrinal content"]
      },
      {
        level: 2,
        description: "Biblical themes integrated naturally with Reformed perspective",
        examples: ["God's sovereignty in creation", "Biblical wisdom literature", "Covenant promises"],
        restrictions: ["Avoid controversial doctrinal disputes"]
      },
      {
        level: 3,
        description: "Explicit Reformed doctrine and confessional content",
        examples: ["Westminster Confession", "Heidelberg Catechism", "Canons of Dort"],
        restrictions: ["Must align with Reformed confessions"]
      }
    ]
  },

  "Reformed Baptist": {
    denomination: "Reformed Baptist",
    theologicalEmphases: [
      "Believer's baptism by immersion",
      "Congregational church government",
      "Reformed soteriology",
      "1689 London Baptist Confession",
      "Scripture authority",
      "Covenant theology (modified)"
    ],
    preferredTranslations: ["ESV", "NASB", "KJV"],
    culturalConsiderations: [
      "Baptist ecclesiology with Reformed theology",
      "Strong biblical literacy",
      "Emphasis on personal conversion"
    ],
    avoidedTopics: [
      "Infant baptism",
      "Presbyterian polity",
      "Works righteousness"
    ],
    preferredApproaches: ["Scripture-centered", "Grace-focused", "Traditional"],
    contentGuidelines: [
      {
        level: 0,
        description: "Secular content appropriate for Christian families",
        examples: ["Academic subjects", "Character development"],
        restrictions: ["No contradictory worldview content"]
      },
      {
        level: 1,
        description: "Christian values emphasizing personal responsibility",
        examples: ["Biblical stewardship", "Personal integrity", "Service"],
        restrictions: ["Avoid sacramental language"]
      },
      {
        level: 2,
        description: "Biblical integration with Baptist distinctives",
        examples: ["Believer's baptism stories", "Church autonomy", "Religious liberty"],
        restrictions: ["No infant baptism content"]
      },
      {
        level: 3,
        description: "Reformed Baptist doctrine and confession",
        examples: ["1689 Confession", "Baptist heritage", "Calvinistic soteriology"],
        restrictions: ["Must align with Reformed Baptist confessions"]
      }
    ]
  },

  "Lutheran LCMS": {
    denomination: "Lutheran LCMS",
    theologicalEmphases: [
      "Justification by faith alone",
      "Scripture and tradition",
      "Sacramental theology",
      "Lutheran Confessions",
      "Law and Gospel distinction",
      "Real presence in communion"
    ],
    preferredTranslations: ["ESV", "NIV", "NKJV"],
    culturalConsiderations: [
      "High view of sacraments",
      "Liturgical tradition",
      "Confessional Lutheran identity",
      "Conservative biblical interpretation"
    ],
    avoidedTopics: [
      "Reformed predestination",
      "Baptist ecclesiology",
      "Pentecostal practices"
    ],
    preferredApproaches: ["Liturgical", "Traditional", "Scripture-centered"],
    contentGuidelines: [
      {
        level: 0,
        description: "Standard academic content",
        examples: ["Secular subjects", "General education"],
        restrictions: ["No religious content"]
      },
      {
        level: 1,
        description: "Lutheran Christian values",
        examples: ["Vocation calling", "Service to neighbor", "Stewardship"],
        restrictions: ["Avoid denominational specifics"]
      },
      {
        level: 2,
        description: "Lutheran theological themes",
        examples: ["Law and Gospel", "Sacramental life", "Liturgical seasons"],
        restrictions: ["Stay within Lutheran tradition"]
      },
      {
        level: 3,
        description: "LCMS doctrine and practice",
        examples: ["Augsburg Confession", "Lutheran liturgy", "Closed communion"],
        restrictions: ["Must align with LCMS positions"]
      }
    ]
  },

  "Methodist UMC": {
    denomination: "Methodist UMC",
    theologicalEmphases: [
      "Prevenient grace",
      "Free will",
      "Social holiness",
      "Wesleyan quadrilateral",
      "Personal and social transformation",
      "Inclusive theology"
    ],
    preferredTranslations: ["NRSV", "NIV", "CEB"],
    culturalConsiderations: [
      "Social justice emphasis",
      "Inclusive approach",
      "Progressive on social issues",
      "Methodical spiritual growth"
    ],
    avoidedTopics: [
      "Predestination",
      "Biblical inerrancy debates",
      "Exclusive salvation"
    ],
    preferredApproaches: ["Service-oriented", "Contemporary", "Grace-focused"],
    contentGuidelines: [
      {
        level: 0,
        description: "Inclusive educational content",
        examples: ["Social awareness", "Cultural diversity", "Environmental stewardship"],
        restrictions: ["No exclusive religious claims"]
      },
      {
        level: 1,
        description: "Methodist Christian values",
        examples: ["Social justice", "Compassion", "Service to marginalized"],
        restrictions: ["Avoid exclusive language"]
      },
      {
        level: 2,
        description: "Wesleyan theological themes",
        examples: ["Prevenient grace", "Social holiness", "Personal transformation"],
        restrictions: ["Include diverse perspectives"]
      },
      {
        level: 3,
        description: "UMC doctrine and social positions",
        examples: ["Wesleyan heritage", "Social creed", "Inclusive practices"],
        restrictions: ["Must align with UMC Book of Discipline"]
      }
    ]
  },

  "Baptist SBC": {
    denomination: "Baptist SBC",
    theologicalEmphases: [
      "Biblical inerrancy",
      "Believer's baptism",
      "Congregational autonomy",
      "Priesthood of believers",
      "Individual soul liberty",
      "Conservative theology"
    ],
    preferredTranslations: ["ESV", "CSB", "NASB"],
    culturalConsiderations: [
      "Conservative biblical interpretation",
      "Strong missions emphasis",
      "Family values focus",
      "Evangelical identity"
    ],
    avoidedTopics: [
      "Infant baptism",
      "Liberal theology",
      "Ecumenical compromise"
    ],
    preferredApproaches: ["Scripture-centered", "Traditional", "Devotional"],
    contentGuidelines: [
      {
        level: 0,
        description: "Conservative academic content",
        examples: ["Traditional subjects", "Character education"],
        restrictions: ["No contradictory worldviews"]
      },
      {
        level: 1,
        description: "Baptist Christian values",
        examples: ["Biblical authority", "Personal integrity", "Missions heart"],
        restrictions: ["Avoid denominational controversy"]
      },
      {
        level: 2,
        description: "Baptist theological distinctives",
        examples: ["Believer's baptism", "Church autonomy", "Biblical authority"],
        restrictions: ["Stay within conservative bounds"]
      },
      {
        level: 3,
        description: "SBC doctrine and practice",
        examples: ["Baptist Faith & Message", "Conservative resurgence", "Inerrancy"],
        restrictions: ["Must align with SBC confessions"]
      }
    ]
  },

  "Pentecostal": {
    denomination: "Pentecostal",
    theologicalEmphases: [
      "Baptism in Holy Spirit",
      "Speaking in tongues",
      "Divine healing",
      "Spiritual gifts",
      "Premillennialism",
      "Experiential Christianity"
    ],
    preferredTranslations: ["KJV", "NKJV", "NIV"],
    culturalConsiderations: [
      "Experiential worship",
      "Supernatural expectation",
      "Emotional expression",
      "Holiness lifestyle"
    ],
    avoidedTopics: [
      "Cessationism",
      "Formalized liturgy",
      "Intellectual rationalism"
    ],
    preferredApproaches: ["Experiential", "Contemporary", "Grace-focused"],
    contentGuidelines: [
      {
        level: 0,
        description: "Standard educational content",
        examples: ["Academic subjects", "Life skills"],
        restrictions: ["No anti-supernatural bias"]
      },
      {
        level: 1,
        description: "Pentecostal Christian values",
        examples: ["Faith expectation", "Spiritual sensitivity", "Holy living"],
        restrictions: ["Avoid cessationist content"]
      },
      {
        level: 2,
        description: "Pentecostal themes and experiences",
        examples: ["Gifts of Spirit", "Divine healing", "Prophetic ministry"],
        restrictions: ["Include supernatural dimension"]
      },
      {
        level: 3,
        description: "Pentecostal doctrine and practice",
        examples: ["Spirit baptism", "Tongues", "Faith healing"],
        restrictions: ["Must affirm continuationist theology"]
      }
    ]
  },

  "Non-denominational Evangelical": {
    denomination: "Non-denominational Evangelical",
    theologicalEmphases: [
      "Biblical authority",
      "Personal relationship with Jesus",
      "Born-again experience",
      "Great Commission",
      "Contemporary worship",
      "Practical Christianity"
    ],
    preferredTranslations: ["NIV", "ESV", "NLT"],
    culturalConsiderations: [
      "Contemporary approach",
      "Practical application",
      "Relationship over religion",
      "Cultural relevance"
    ],
    avoidedTopics: [
      "Denominational disputes",
      "Overly academic theology",
      "Traditional liturgy"
    ],
    preferredApproaches: ["Contemporary", "Devotional", "Service-oriented"],
    contentGuidelines: [
      {
        level: 0,
        description: "Neutral educational content",
        examples: ["Standard academics", "Character building"],
        restrictions: ["No anti-Christian bias"]
      },
      {
        level: 1,
        description: "Evangelical Christian values",
        examples: ["Personal faith", "Biblical principles", "Servant leadership"],
        restrictions: ["Avoid denominational language"]
      },
      {
        level: 2,
        description: "Evangelical themes and practices",
        examples: ["Personal relationship with Jesus", "Bible study", "Christian living"],
        restrictions: ["Keep practical and accessible"]
      },
      {
        level: 3,
        description: "Evangelical doctrine and mission",
        examples: ["Salvation by faith", "Great Commission", "Biblical worldview"],
        restrictions: ["Must maintain evangelical distinctives"]
      }
    ]
  },

  "Presbyterian PCA": {
    denomination: "Presbyterian PCA",
    theologicalEmphases: [
      "Westminster Standards",
      "Reformed theology",
      "Presbyterian polity",
      "Biblical inerrancy",
      "Covenant theology",
      "Confessional subscription"
    ],
    preferredTranslations: ["ESV", "NASB", "NIV"],
    culturalConsiderations: [
      "Conservative Presbyterian identity",
      "Confessional commitment",
      "Ordered worship",
      "Educational emphasis"
    ],
    avoidedTopics: [
      "Liberal theology",
      "Congregational polity",
      "Arminian theology"
    ],
    preferredApproaches: ["Scripture-centered", "Academic", "Traditional"],
    contentGuidelines: [
      {
        level: 0,
        description: "Classical educational content",
        examples: ["Liberal arts", "Classical education", "Logic and rhetoric"],
        restrictions: ["No contradictory worldviews"]
      },
      {
        level: 1,
        description: "Presbyterian Christian values",
        examples: ["Ordered living", "Educational excellence", "Covenant faithfulness"],
        restrictions: ["Avoid Baptist distinctives"]
      },
      {
        level: 2,
        description: "Presbyterian theological themes",
        examples: ["Covenant theology", "Presbyterian worship", "Confessional faith"],
        restrictions: ["Stay within Reformed tradition"]
      },
      {
        level: 3,
        description: "PCA doctrine and practice",
        examples: ["Westminster Confession", "Presbyterian polity", "Biblical inerrancy"],
        restrictions: ["Must align with PCA standards"]
      }
    ]
  },

  "Anglican": {
    denomination: "Anglican",
    theologicalEmphases: [
      "Via media (middle way)",
      "Book of Common Prayer",
      "Episcopal succession",
      "Sacramental theology",
      "Scripture, tradition, reason",
      "Liturgical worship"
    ],
    preferredTranslations: ["NRSV", "ESV", "KJV"],
    culturalConsiderations: [
      "Liturgical tradition",
      "Historical consciousness",
      "Reasoned faith",
      "Cultural engagement"
    ],
    avoidedTopics: [
      "Protestant fundamentalism",
      "Roman Catholic authority",
      "Sectarian exclusivism"
    ],
    preferredApproaches: ["Liturgical", "Traditional", "Academic"],
    contentGuidelines: [
      {
        level: 0,
        description: "Classical liberal education",
        examples: ["Humanities", "Arts", "Cultural studies"],
        restrictions: ["No sectarian content"]
      },
      {
        level: 1,
        description: "Anglican Christian values",
        examples: ["Reasoned faith", "Cultural engagement", "Sacramental living"],
        restrictions: ["Avoid fundamentalist language"]
      },
      {
        level: 2,
        description: "Anglican theological themes",
        examples: ["Via media", "Liturgical seasons", "Sacramental theology"],
        restrictions: ["Balance Protestant and Catholic elements"]
      },
      {
        level: 3,
        description: "Anglican doctrine and practice",
        examples: ["Book of Common Prayer", "Thirty-Nine Articles", "Episcopal tradition"],
        restrictions: ["Must reflect Anglican comprehensiveness"]
      }
    ]
  },

  "Catholic": {
    denomination: "Catholic",
    theologicalEmphases: [
      "Papal authority",
      "Sacred Tradition",
      "Sacramental system",
      "Saints and Mary",
      "Natural law",
      "Social teaching"
    ],
    preferredTranslations: ["NAB", "RSV-CE", "NRSV-CE"],
    culturalConsiderations: [
      "Universal church identity",
      "Intellectual tradition",
      "Social justice emphasis",
      "Liturgical calendar"
    ],
    avoidedTopics: [
      "Protestant reformation",
      "Sola scriptura",
      "Clerical marriage"
    ],
    preferredApproaches: ["Liturgical", "Academic", "Service-oriented"],
    contentGuidelines: [
      {
        level: 0,
        description: "Classical Catholic education",
        examples: ["Liberal arts", "Natural law philosophy", "Cultural heritage"],
        restrictions: ["No anti-Catholic content"]
      },
      {
        level: 1,
        description: "Catholic Christian values",
        examples: ["Social justice", "Dignity of life", "Stewardship"],
        restrictions: ["Avoid Protestant distinctives"]
      },
      {
        level: 2,
        description: "Catholic theological themes",
        examples: ["Sacramental life", "Saints", "Catholic social teaching"],
        restrictions: ["Include Catholic tradition"]
      },
      {
        level: 3,
        description: "Catholic doctrine and practice",
        examples: ["Catechism", "Papal teaching", "Catholic liturgy"],
        restrictions: ["Must align with Magisterium"]
      }
    ]
  },

  "General Christian": {
    denomination: "General Christian",
    theologicalEmphases: [
      "Jesus Christ as Savior",
      "Biblical foundation",
      "Christian living",
      "Love of God and neighbor",
      "Christian unity",
      "Basic orthodoxy"
    ],
    preferredTranslations: ["NIV", "ESV", "NLT"],
    culturalConsiderations: [
      "Broad Christian appeal",
      "Avoid divisive issues",
      "Focus on common ground",
      "Practical application"
    ],
    avoidedTopics: [
      "Denominational disputes",
      "Controversial doctrines",
      "Sectarian language"
    ],
    preferredApproaches: ["Contemporary", "Devotional", "Service-oriented"],
    contentGuidelines: [
      {
        level: 0,
        description: "Broad educational content",
        examples: ["General academics", "Universal values"],
        restrictions: ["No religious specificity"]
      },
      {
        level: 1,
        description: "General Christian values",
        examples: ["Love", "Forgiveness", "Service", "Integrity"],
        restrictions: ["Avoid denominational distinctives"]
      },
      {
        level: 2,
        description: "Basic Christian themes",
        examples: ["Jesus' teachings", "Christian holidays", "Bible stories"],
        restrictions: ["Stay with widely accepted content"]
      },
      {
        level: 3,
        description: "Basic Christian doctrine",
        examples: ["Trinity", "Salvation", "Christian life", "Prayer"],
        restrictions: ["Must represent broad Christian consensus"]
      }
    ]
  }
};
