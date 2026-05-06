/* ==========================================================================
    PRODUCT DATABASE
   ========================================================================== */

const productDatabase = [
    // --- 15 ACADEMIC BOOKS ---
    { 
        id: "academic1", type: "Book", category: "Academic", title: "Intermediate Accounting Volume 3", authorOrBrand: "Vhinson Jay Gaarcia", price: 2525.0, stock: 45, totalSold: 1250, releaseDate: "2025-01-15", imageFile: "images/academic/intermediate-accounting-volume-3.jpg", 
        description: "Master the most advanced financial accounting principles with this highly comprehensive, up-to-date volume. It thoroughly covers complex topics such as statement of cash flows, accounting for income taxes, pensions, and leases under the latest reporting standards. The textbook features numerous real-world case studies and challenging problem sets designed to test analytical skills. It is absolutely perfect for dedicated accounting students aggressively pursuing a CPA track. This text bridges the gap between fundamental theories and high-level professional practice." 
    },
    { 
        id: "academic2", type: "Book", category: "Academic", title: "Data Structures in C++", authorOrBrand: "D.S. Malik", price: 1755.0, stock: 14, totalSold: 1340, releaseDate: "2024-07-30", imageFile: "images/academic/data-structures-using-cpp.jpg", 
        description: "Learn how to build highly efficient algorithms and optimize software memory using the powerful C++ programming language. The author clearly explains complex concepts such as linked lists, binary trees, stacks, queues, and sorting algorithms through visual diagrams. Every chapter includes extensive coding examples and hands-on exercises to reinforce the theoretical concepts. These foundational techniques are absolutely essential for aspiring software engineers preparing for technical interviews. The book emphasizes writing clean, scalable code that performs well under heavy computational loads." 
    },
    { 
        id: "academic3", type: "Book", category: "Academic", title: "Discrete Math", authorOrBrand: "Kenneth Rosen", price: 2155.0, stock: 33, totalSold: 2120, releaseDate: "2024-02-14", imageFile: "images/academic/discrete-mathematics-and-its-applications.jpg", 
        description: "The mathematical foundations essential for modern computer science are clearly explained in this definitive textbook. Students will tackle formal logic, mathematical proofs, graph theory, and advanced combinatorics head-on. The material is structured to develop the rigorous analytical thinking required for designing algorithms and cryptography systems. Hundreds of applied examples connect abstract mathematics to practical computing problems encountered in the real world. It is an indispensable resource for anyone serious about pursuing a career in theoretical computing or data science." 
    },
    { 
        id: "academic4", type: "Book", category: "Academic", title: "Engineering Mechanics", authorOrBrand: "R.C. Hibbeler", price: 2599.0, stock: 7, totalSold: 1650, releaseDate: "2022-06-25", imageFile: "images/academic/engineering-mechanics.jpg", 
        description: "Master the strict fundamentals of statics and dynamics required for all civil and mechanical engineering students. This textbook systematically breaks down the principles of force vectors, equilibrium, rigid bodies, and kinematics. It is renowned for its exceptional clarity and highly detailed, step-by-step problem-solving methodologies. Students will develop their structural analysis skills with hundreds of practical, real-world examples and diagrams. It serves as the ultimate cornerstone for understanding how physical structures withstand environmental loads." 
    },
    { 
        id: "academic5", type: "Book", category: "Academic", title: "Foundation of Computer Science", authorOrBrand: "Behrouz A. Forouzan", price: 1985.0, stock: 30, totalSold: 1500, releaseDate: "2024-01-05", imageFile: "images/academic/foundation-of-computer-science.jpg", 
        description: "Dive into an engaging, broad introduction to data representation, hardware architecture, and core algorithms. This book perfectly balances the theoretical aspects of computing with the practical realities of modern system design. It covers essential topics ranging from binary logic and operating systems to networking and basic cybersecurity. The accessible language makes it a perfect starting point for tech-focused academics entering their first year of study. It provides the broad context necessary to succeed in specialized upper-level IT courses." 
    },
    { 
        id: "academic6", type: "Book", category: "Academic", title: "Human Anatomy and Physiology", authorOrBrand: "Elaine N. Marieb", price: 599.0, stock: 11, totalSold: 3000, releaseDate: "2023-11-10", imageFile: "images/academic/human-anatomy-and-physiology.jpg", 
        description: "Embark on a highly detailed exploration of human body systems, from microscopic cellular functions to macroscopic organ structures. The textbook utilizes stunning, full-color medical illustrations and clinical case studies to bridge the gap between classroom theory and hospital practice. It thoroughly covers homeostasis, the nervous system, endocrinology, and muscular mechanics in a way that is easy to digest. It is considered a crucial, foundational resource for nursing, pre-med, and general biology students. The integrated study tools help guarantee retention of complex biological terminology." 
    },
    { 
        id: "academic7", type: "Book", category: "Academic", title: "Intro to Sociology", authorOrBrand: "Anthony Giddens", price: 1405.0, stock: 19, totalSold: 980, releaseDate: "2024-09-05", imageFile: "images/academic/introduction-to-sociology.jpg", 
        description: "Gain a profound understanding of modern society, shifting culture, and complex human interaction on a macro scale. This textbook dives deep into the fundamental theories of social behavior, examining topics like class inequality, gender dynamics, and globalization. The author seamlessly connects classical sociological paradigms with contemporary social issues dominating the news cycle today. It encourages students to develop a critical 'sociological imagination' to better analyze their own personal experiences. It is an incredibly eye-opening read for students in the humanities and social sciences." 
    },
    { 
        id: "academic8", type: "Book", category: "Academic", title: "Macroeconomics", authorOrBrand: "N. Gregory Mankiw", price: 1535.0, stock: 8, totalSold: 2100, releaseDate: "2025-02-10", imageFile: "images/academic/macroeconomics.jpg", 
        description: "This highly accessible textbook provides a remarkably solid economic framework for understanding large-scale fiscal systems. Students will learn how to properly analyze global markets, national monetary policies, and the complex causes of inflation. The author uses extremely clear, real-world examples to demystify GDP, unemployment rates, and international trade dynamics. It equips future business leaders and policymakers with the tools needed to predict and respond to economic shifts. It is universally recognized as the gold standard for introductory college economics courses." 
    },
    { 
        id: "academic9", type: "Book", category: "Academic", title: "Mathematics in the Modern World", authorOrBrand: "Romeo Daligdig", price: 399.0, stock: 18, totalSold: 2500, releaseDate: "2023-10-22", imageFile: "images/academic/mathematics-in-the-modern-world.jpg", 
        description: "Explore exactly how mathematics shapes our modern reality beyond basic arithmetic and rigid algebraic formulas. This engaging text demonstrates the incredible presence of mathematical patterns in nature, art, cryptography, and financial systems. It shifts the focus away from rote memorization and toward developing logical reasoning and practical problem-solving skills. Students will gain a much deeper appreciation for the mathematical logic underpinning technology and everyday life. It is specifically designed to make math approachable and relevant for non-STEM majors." 
    },
    { 
        id: "academic10", type: "Book", category: "Academic", title: "Microbiology", authorOrBrand: "Marjorie Cowan", price: 2199.0, stock: 25, totalSold: 670, releaseDate: "2025-03-11", imageFile: "images/academic/microbiology.jpg", 
        description: "Take a strict clinical approach to understanding the fascinating world of microbes, viruses, and infectious diseases. This textbook emphasizes the vital relationship between human hosts and pathogens, highlighting modern immunological responses and treatment protocols. The chapters are heavily grounded in real-world medical scenarios, making the science deeply relevant to aspiring healthcare professionals. It includes vivid electron micrographs and easy-to-follow diagrams of complex cellular processes. It is an absolutely perfect core text for nursing, pharmacology, and health science programs." 
    },
    { 
        id: "academic11", type: "Book", category: "Academic", title: "Modern Biology", authorOrBrand: "Campbell & Reece", price: 2855.0, stock: 12, totalSold: 980, releaseDate: "2024-11-20", imageFile: "images/academic/modern-biology.jpg", 
        description: "This is widely considered the premier, most authoritative undergraduate textbook for the biological sciences globally. It covers everything from incredibly detailed cellular biology and genetics to massive ecosystems and evolutionary history. The text is renowned for its unparalleled accuracy, engaging narrative style, and spectacular visual aids. Every chapter integrates the latest scientific discoveries while maintaining a clear focus on core biological themes. It remains the ultimate desk reference for anyone pursuing a degree in the life sciences." 
    },
    { 
        id: "academic12", type: "Book", category: "Academic", title: "Organic Chemistry", authorOrBrand: "K. Peter C. Vollhardt", price: 3105.0, stock: 5, totalSold: 840, releaseDate: "2023-12-01", imageFile: "images/academic/organic-chemistry.jpg", 
        description: "Understand the intricate structure, reactivity, and function of complex organic molecules with this rigorous textbook. The authors masterfully guide students through difficult reaction mechanisms, stereochemistry, and advanced chemical synthesis. The book heavily emphasizes a logical, problem-solving approach rather than relying on the brute memorization of isolated facts. It includes hundreds of practice problems designed to mirror the difficulty of actual medical school entrance exams. It is an essential, albeit challenging, resource for chemistry majors and pre-medical students." 
    },
    { 
        id: "academic13", type: "Book", category: "Academic", title: "Physics for Scientists and Engineers", authorOrBrand: "Serway & Jewett", price: 2899.0, stock: 40, totalSold: 1890, releaseDate: "2024-04-01", imageFile: "images/academic/physics-for-scientists-and-engineers.jpg", 
        description: "This massive calculus-based physics text meticulously covers mechanics, thermodynamics, electromagnetism, and modern optics. It heavily emphasizes deep conceptual understanding alongside extremely rigorous, formulaic problem-solving skills. The authors frequently tie complex physical laws to highly relevant real-world engineering applications and modern technologies. The robust end-of-chapter exercises are specifically designed to test a student's ability to apply calculus to physical phenomena. It is the definitive foundational text for university-level engineering and physics programs." 
    },
    { 
        id: "academic14", type: "Book", category: "Academic", title: "Psychology 101", authorOrBrand: "David G. Myers", price: 599.0, stock: 55, totalSold: 3200, releaseDate: "2023-08-14", imageFile: "images/academic/psychology-101.jpg", 
        description: "Enjoy an incredibly engaging and scientifically rigorous introduction to human behavior and complex mental processes. The author masterfully uncovers what exactly drives human thought, emotion, memory, and social interactions. The book presents the latest psychological research through relatable anecdotes and highly practical, everyday applications. It covers major psychological disorders, developmental stages, and the biological underpinnings of the brain. This is a wonderfully accessible and deeply fascinating read for students across all disciplines." 
    },
    { 
        id: "academic15", type: "Book", category: "Academic", title: "World History", authorOrBrand: "William Duiker", price: 599.0, stock: 22, totalSold: 1100, releaseDate: "2024-05-18", imageFile: "images/academic/world-history.jpg", 
        description: "Immerse yourself in a comprehensive, chronological narrative of human civilization expanding across the entire globe. This text traces the dynamic development of ancient cultures, the rise of powerful empires, and the formation of modern nations. The authors take a balanced, global perspective, ensuring that Eastern and Western histories are given equal analytical weight. It explores the profound impacts of major wars, shifting trade routes, and sweeping technological revolutions on society. It provides the crucial historical context needed to truly understand modern geopolitics." 
    },

    // --- 10 MANGA (Category: Fiction) ---
    { 
        id: "manga1", type: "Book", category: "Fiction", title: "Attack on Titan Volume 3", authorOrBrand: "Hajime Isayama", price: 499.0, stock: 40, totalSold: 7800, releaseDate: "2018-09-01", imageFile: "images/manga/attack-on-titan-volume-3.jpg", 
        description: "Humanity's desperate fight against the man-eating Titans continues as the walls are breached once again. Eren Yeager discovers a terrifying and mysterious new ability that could either save mankind or ensure its total destruction. The military scrambles to understand this new development while fending off the relentless, grotesque invaders. Betrayals and hidden agendas begin to surface, making it clear that the Titans might not be the only enemy. This volume ramps up the action and deepens the dark, apocalyptic lore of the series." 
    },
    { 
        id: "manga2", type: "Book", category: "Fiction", title: "Bleach Volume 2", authorOrBrand: "Tite Kubo", price: 455.0, stock: 15, totalSold: 4300, releaseDate: "2016-02-14", imageFile: "images/manga/bleach-volume-2.jpg", 
        description: "Ichigo Kurosaki's unexpected duties as a substitute Soul Reaper intensify as more Hollows invade his hometown. He must quickly learn to master his massive zanpakuto and his newfound spiritual pressure to protect his friends and family. Meanwhile, Rukia Kuchiki struggles to adapt to living in a human gigai while secretly guiding Ichigo through his deadly missions. The volume introduces fan-favorite supporting characters like Orihime and Chad, teasing their own latent spiritual powers. Action-packed and stylish, this installment cements the supernatural foundation of the series." 
    },
    { 
        id: "manga3", type: "Book", category: "Fiction", title: "Death Note Volume 1", authorOrBrand: "Tsugumi Ohba", price: 525.0, stock: 12, totalSold: 9200, releaseDate: "2010-10-10", imageFile: "images/manga/death-note-volume-1.jpg", 
        description: "Brilliant high school student Light Yagami discovers a mysterious notebook dropped by a bored Shinigami named Ryuk. Light quickly realizes that writing a person's name in the Death Note results in their immediate demise. Driven by a twisted sense of justice, he begins a dark crusade to rid the world of violent criminals and establish himself as a god. However, his actions catch the attention of the enigmatic and eccentric master detective known only as 'L'. A high-stakes, psychological game of cat-and-mouse begins that will keep you on the edge of your seat." 
    },
    { 
        id: "manga4", type: "Book", category: "Fiction", title: "Demon Slayer Volume 2", authorOrBrand: "Koyoharu Gotouge", price: 485.0, stock: 55, totalSold: 8500, releaseDate: "2020-11-20", imageFile: "images/manga/demon-slayer-volume-2.jpg", 
        description: "Tanjiro Kamado faces his first official assignment as a Demon Slayer, investigating young girls who are mysteriously vanishing in a nearby town. Accompanied by his demonized sister Nezuko, he must track down a terrifying swamp demon that uses blood demon arts to clone itself. The battle pushes Tanjiro to his absolute limits, forcing him to adapt his Water Breathing techniques on the fly. He also encounters another deadly enemy tied directly to the progenitor of all demons, Muzan Kibutsuji. This volume beautifully balances intense, stylized combat with deep emotional stakes." 
    },
    { 
        id: "manga5", type: "Book", category: "Fiction", title: "Fullmetal Alchemist Volume 5", authorOrBrand: "Hiromu Arakawa", price: 555.0, stock: 18, totalSold: 5800, releaseDate: "2012-04-18", imageFile: "images/manga/fullmetal-alchemist-volume-5.jpg", 
        description: "Edward and Alphonse Elric uncover horrific, dark secrets regarding the true nature of the Philosopher's Stone. Their investigation leads them to a classified military laboratory where they are forced into brutal combat against soul-bound suits of armor and monstrous chimeras. The brothers realize that a massive, deadly conspiracy extends to the highest ranks of the State Military. Meanwhile, the serial killer Scar continues his relentless crusade against State Alchemists, complicating their already dangerous mission. The emotional weight and political intrigue of the series escalate dramatically in these chapters." 
    },
    { 
        id: "manga6", type: "Book", category: "Fiction", title: "Haikyuu Volume 4", authorOrBrand: "Haruichi Furudate", price: 455.0, stock: 42, totalSold: 7100, releaseDate: "2019-07-22", imageFile: "images/manga/haikyu-volume-4.jpg", 
        description: "The Karasuno High School volleyball team gears up for the highly anticipated Inter-High tournament qualifiers. With their eccentric new coach pushing them to their physical limits, the team works tirelessly to perfect their chaotic quick-attack strategy. Hinata and Kageyama must learn to trust each other completely if they want to overcome their towering opponents on the court. Tensions run high as they face off against rival schools known for their impenetrable defenses and veteran players. It is a thrilling showcase of teamwork, sheer determination, and the love of the sport." 
    },
    { 
        id: "manga7", type: "Book", category: "Fiction", title: "Jujutsu Kaisen Volume 6", authorOrBrand: "Gege Akutami", price: 485.0, stock: 60, totalSold: 8900, releaseDate: "2021-03-15", imageFile: "images/manga/jujutsu-kaisen-volume-6.jpg", 
        description: "The highly anticipated Kyoto Sister-School Goodwill Event finally begins, pitting the Tokyo and Kyoto jujutsu students against each other. Yuji Itadori immediately becomes the primary target of the Kyoto students, who have been secretly ordered to assassinate him during the team battle. Amidst the chaos of fighting powerful curses in the forest, Yuji faces off against the muscle-bound Aoi Todo, resulting in an unexpectedly hilarious yet brutal brawl. Meanwhile, sinister curses scheme in the shadows, waiting for the perfect moment to breach the school's magical barriers. This arc delivers spectacular choreography and major character development." 
    },
    { 
        id: "manga8", type: "Book", category: "Fiction", title: "My Hero Academia Volume 1", authorOrBrand: "Kohei Horikoshi", price: 455.0, stock: 35, totalSold: 6700, releaseDate: "2017-06-05", imageFile: "images/manga/my-hero-academia-volume-1.jpg", 
        description: "Izuku Midoriya's incredible origin story begins right here in a superhuman society where eighty percent of the population possesses a 'Quirk'. Despite being born completely quirkless, Izuku dreams of nothing but becoming the greatest hero and saving people with a fearless smile. A fateful, life-threatening encounter with his ultimate idol, the legendary hero All Might, changes the trajectory of his entire life. Recognizing the boy's true heroic spirit, All Might passes his own world-shattering Quirk down to the determined teenager. Now, Izuku must survive the grueling entrance exam for the prestigious U.A. High School to kickstart his dream." 
    },
    { 
        id: "manga9", type: "Book", category: "Fiction", title: "Naruto Volume 3", authorOrBrand: "Masashi Kishimoto", price: 455.0, stock: 25, totalSold: 5200, releaseDate: "2015-05-10", imageFile: "images/manga/naruto-volume-3.jpg", 
        description: "Team 7's first major C-rank mission in the Land of Waves reaches its thrilling, emotional climax. Naruto, Sasuke, and Kakashi find themselves locked in a desperate, deadly battle against the fearsome rogue ninja Zabuza and his incredibly gifted protégé, Haku. Sasuke awakens his clan's legendary Sharingan eyes, while Naruto's suppressed, monstrous nine-tails chakra begins to leak out in a fit of absolute rage. The encounter forces the young genin to confront the harsh, brutal realities of the ninja world for the very first time. It is a landmark volume that solidifies the series' reputation for intense action and profound storytelling." 
    },
    { 
        id: "manga10", type: "Book", category: "Fiction", title: "One Piece Volume 1", authorOrBrand: "Eiichiro Oda", price: 455.0, stock: 30, totalSold: 6100, releaseDate: "2014-08-20", imageFile: "images/manga/one-piece-volume-1.jpg", 
        description: "Romance Dawn marks the unforgettable beginning of Monkey D. Luffy's epic, ocean-spanning journey to become the King of the Pirates. Armed with the strange, rubber-like powers granted by the mysterious Gum-Gum Devil Fruit, Luffy sets sail in a tiny boat to gather a mighty crew. He quickly crosses paths with Koby, a cowardly cabin boy, and Zoro, an infamous pirate hunter with a terrifying three-sword fighting style. Together, they must liberate a naval town from the tyrannical rule of a corrupt Marine captain. This volume sets the perfect stage for the greatest adventure in manga history." 
    },

    // --- 15 NON-FICTION ---
    { 
        id: "nonfiction1", type: "Book", category: "Non-Fiction", title: "Atomic Habits", authorOrBrand: "James Clear", price: 855.0, stock: 80, totalSold: 12000, releaseDate: "2018-10-16", imageFile: "images/non-fiction/atomic-habits.jpg", 
        description: "Tiny, seemingly insignificant changes can compound into truly remarkable, life-altering results over time. James Clear provides a proven, scientifically-backed framework for building good habits and permanently breaking bad ones. By focusing on systems rather than goals, the book teaches readers how to make small improvements of just one percent every day. It covers practical strategies like habit stacking, environmental design, and identity shifting to guarantee long-term success. This is an essential read for anyone looking to optimize their daily routine and achieve personal mastery." 
    },
    { 
        id: "nonfiction2", type: "Book", category: "Non-Fiction", title: "Can't Hurt Me", authorOrBrand: "David Goggins", price: 955.0, stock: 75, totalSold: 13000, releaseDate: "2018-12-04", imageFile: "images/non-fiction/cant-hurt-me.jpg", 
        description: "Master your mind and defy all the odds with this incredibly raw and powerful memoir from a former Navy SEAL. David Goggins shares his unbelievable journey from a depressed, overweight young man experiencing severe prejudice to becoming one of the world's top endurance athletes. He introduces the concept of the '40% Rule,' arguing that most human beings tap into only a fraction of their true capabilities. The book challenges readers to push past pain, embrace suffering, and callous their minds against adversity. It is a highly motivational manual for anyone seeking to completely transform their life." 
    },
    { 
        id: "nonfiction3", type: "Book", category: "Non-Fiction", title: "Dare to Lead", authorOrBrand: "Brené Brown", price: 885.0, stock: 40, totalSold: 6500, releaseDate: "2018-10-09", imageFile: "images/non-fiction/dare-to-lead.jpg", 
        description: "Brave work and tough, honest conversations are absolutely essential for great, modern leadership. Brené Brown dismantles the myth that vulnerability is a weakness, proving instead that it is the ultimate measure of true courage. The book provides actionable strategies for cultivating empathy, building trust, and fostering an inclusive culture within any organization. By stepping into the arena and embracing difficult emotions, leaders can unlock the full creative potential of their teams. It is a paradigm-shifting guide for managers, executives, and anyone looking to lead with a whole heart." 
    },
    { 
        id: "nonfiction4", type: "Book", category: "Non-Fiction", title: "Deep Work", authorOrBrand: "Cal Newport", price: 795.0, stock: 55, totalSold: 7600, releaseDate: "2016-01-05", imageFile: "images/non-fiction/deep-work.jpg", 
        description: "Learn the essential rules for achieving focused success in a world increasingly dominated by digital distractions and shallow tasks. Cal Newport argues that the ability to focus without distraction on a cognitively demanding task is a rare and highly valuable skill. The book provides rigorous training techniques to help readers cultivate states of deep concentration, dramatically improving their productivity and output quality. It challenges the modern culture of constant connectivity and multi-tasking by advocating for scheduled periods of intense, uninterrupted work. This is a vital resource for professionals and creatives looking to truly excel." 
    },
    { 
        id: "nonfiction5", type: "Book", category: "Non-Fiction", title: "Essentialism", authorOrBrand: "Greg McKeown", price: 785.0, stock: 50, totalSold: 6800, releaseDate: "2014-04-15", imageFile: "images/non-fiction/essentialism.jpg", 
        description: "The disciplined pursuit of less is the key to achieving true focus and meaningful productivity. Greg McKeown challenges the notion that we must accomplish everything, advocating instead for doing only what is absolutely essential. The book guides readers through the process of fiercely editing their lives, learning to say 'no' to non-vital commitments, and directing their energy toward their highest point of contribution. It is not just a time-management strategy, but a systematic discipline for reclaiming control of your choices. Essentialism helps you design a life that truly matters, rather than simply reacting to the demands of others." 
    },
    { 
        id: "nonfiction6", type: "Book", category: "Non-Fiction", title: "Good to Great", authorOrBrand: "Jim Collins", price: 899.0, stock: 28, totalSold: 8800, releaseDate: "2001-10-16", imageFile: "images/non-fiction/good-to-great.jpg", 
        description: "Discover exactly why some mediocre companies make the massive leap to greatness while others fail to adapt. Jim Collins and his research team analyzed decades of corporate data to identify the specific, underlying characteristics that define truly elite organizations. The book introduces vital business concepts such as Level 5 Leadership, the Hedgehog Concept, and the Flywheel Effect. It emphasizes the importance of confronting brutal realities while maintaining unwavering faith in ultimate success. This classic management book remains a definitive guide for entrepreneurs and executives seeking long-term sustainability." 
    },
    { 
        id: "nonfiction7", type: "Book", category: "Non-Fiction", title: "Outliers", authorOrBrand: "Malcolm Gladwell", price: 855.0, stock: 48, totalSold: 9400, releaseDate: "2008-11-18", imageFile: "images/non-fiction/outliers.jpg", 
        description: "The conventional story of massive success is much more complex and nuanced than society generally believes. Malcolm Gladwell explores the hidden, external factors that create high achievers, looking beyond sheer talent and individual merit. He examines how cultural background, exact birth dates, historical timing, and the famous '10,000-Hour Rule' all play critical roles in shaping extraordinary outcomes. From Canadian hockey players to software billionaires, the book reveals the invisible advantages that propel certain people to the top. It is a fascinating sociological journey that forever changes how we view ambition and accomplishment." 
    },
    { 
        id: "nonfiction8", type: "Book", category: "Non-Fiction", title: "Rich Dad Poor Dad", authorOrBrand: "Robert Kiyosaki", price: 899.0, stock: 65, totalSold: 15000, releaseDate: "1997-04-01", imageFile: "images/non-fiction/rich-dad-poor-dad.jpg", 
        description: "Find out exactly what the wealthy teach their children about money that the poor and middle class do not. Robert Kiyosaki uses the contrasting financial philosophies of his two 'fathers' to illustrate the massive difference between working for money and making money work for you. The book shatters the myth that earning a high income is the only path to building lasting wealth. It strongly advocates for financial literacy, explaining the crucial differences between income-generating assets and draining liabilities. This is a foundational text for anyone looking to escape the rat race and achieve true financial independence." 
    },
    { 
        id: "nonfiction9", type: "Book", category: "Non-Fiction", title: "Sapiens", authorOrBrand: "Yuval Noah Harari", price: 955.0, stock: 45, totalSold: 9800, releaseDate: "2015-02-10", imageFile: "images/non-fiction/sapiens.jpg", 
        description: "Explore a brilliantly synthesized, brief history of humankind stretching from the Stone Age directly into the modern era. Yuval Noah Harari examines how Homo sapiens came to utterly dominate the planet through the Cognitive, Agricultural, and Scientific Revolutions. The book delves into our unique ability to create and believe in shared fictions, such as money, religion, and nations, which allowed for massive societal cooperation. It challenges deeply held assumptions about human happiness, progress, and our relationship with the natural world. This sweeping narrative provides profound insights into exactly how biology and history have defined us." 
    },
    { 
        id: "nonfiction10", type: "Book", category: "Non-Fiction", title: "Start with Why", authorOrBrand: "Simon Sinek", price: 755.0, stock: 62, totalSold: 9100, releaseDate: "2009-10-29", imageFile: "images/non-fiction/start-with-why.jpg", 
        description: "Learn how great, transformative leaders naturally inspire everyone around them to take meaningful action. Simon Sinek introduces the 'Golden Circle' framework, demonstrating that successful organizations always communicate from the inside out, starting with their core purpose. He uses compelling examples from Apple, Martin Luther King Jr., and the Wright Brothers to prove that people don't buy what you do; they buy why you do it. The book provides a powerful blueprint for building profound loyalty and driving long-term innovation. It is required reading for anyone hoping to build a culture of trust and shared vision." 
    },
    { 
        id: "nonfiction11", type: "Book", category: "Non-Fiction", title: "The 48 Laws of Power", authorOrBrand: "Robert Greene", price: 899.0, stock: 40, totalSold: 14500, releaseDate: "1998-09-01", imageFile: "images/non-fiction/the-48-laws-of-power.jpg", 
        description: "Amoral, cunning, ruthless, and highly instructive, this book is the definitive, unvarnished guide to mastering complex power dynamics. Drawing from three thousand years of history and the philosophies of Machiavelli, Sun Tzu, and Carl von Clausewitz, Robert Greene distills the essence of control into 48 distinct laws. Readers learn vital lessons about concealing intentions, crushing enemies, and utilizing the psychological weaknesses of others. Whether you are aiming for total conquest or simply trying to defend yourself against manipulation, the strategies inside are fiercely practical. It remains a highly controversial but undeniably captivating manual for survival." 
    },
    { 
        id: "nonfiction12", type: "Book", category: "Non-Fiction", title: "The Psychology of Money", authorOrBrand: "Morgan Housel", price: 825.0, stock: 110, totalSold: 10200, releaseDate: "2020-09-08", imageFile: "images/non-fiction/the-psychology-of-money.jpg", 
        description: "Read these timeless, profoundly insightful lessons on wealth, greed, and happiness from a behavioral finance perspective. Morgan Housel argues that doing well with money has very little to do with raw intelligence and everything to do with how you behave. Through a series of short, engaging stories, the book explores the strange ways people think about risk, the role of luck, and the illusion of control. It teaches readers how to make better sense of their own financial decisions by recognizing emotional blind spots. This refreshing take on personal finance prioritizes peace of mind over raw returns." 
    },
    { 
        id: "nonfiction13", type: "Book", category: "Non-Fiction", title: "Thinking, Fast and Slow", authorOrBrand: "Daniel Kahneman", price: 925.0, stock: 30, totalSold: 8400, releaseDate: "2011-10-25", imageFile: "images/non-fiction/thinking-fast-and-slow.jpg", 
        description: "The two incredibly distinct cognitive systems that drive the way we think are fascinatingly broken down by a Nobel laureate. System 1 is fast, intuitive, and emotional, while System 2 is slower, more deliberative, and vastly more logical. Daniel Kahneman exposes the extraordinary capabilities, as well as the inherent biases and faults, of our fast-thinking intuition. The book explains how cognitive illusions impact our economic choices, corporate strategies, and everyday judgments. It is a masterpiece of behavioral economics that will permanently alter how you approach decision-making." 
    },
    { 
        id: "nonfiction14", type: "Book", category: "Non-Fiction", title: "Zero to One", authorOrBrand: "Peter Thiel", price: 825.0, stock: 35, totalSold: 7900, releaseDate: "2014-09-16", imageFile: "images/non-fiction/zero-to-one.jpg", 
        description: "These brilliant, contrarian notes on startups reveal how to truly build the future by avoiding intense competition. Peter Thiel argues that copying existing models only takes the world from 1 to n, adding familiar things, but creating something entirely new takes us from zero to one. The book emphasizes the critical importance of building unique monopolies, utilizing proprietary technology, and cultivating strong founding teams. It challenges the conventional wisdom of Silicon Valley, urging entrepreneurs to seek out bold, uncharted territories. It is a concise, philosophical manifesto for ambitious creators looking to make a massive impact." 
    },
    { 
        id: "nonfiction15", type: "Book", category: "Non-Fiction", title: "How to Win Friends and Influence People", authorOrBrand: "Dale Carnegie", price: 899.0, stock: 85, totalSold: 16000, releaseDate: "1936-10-01", imageFile: "images/non-fiction/how-to-win-friends-and-influence-people.jpg", 
        description: "This timeless, classic manual on human relations has helped millions of people climb the ladder of success in both their business and personal lives. Dale Carnegie lays out simple, incredibly effective principles for handling people, making them like you, and winning them over to your way of thinking. The book heavily emphasizes the power of active listening, offering sincere appreciation, and avoiding harsh criticism. By implementing these empathetic strategies, readers can dramatically improve their social skills and build lasting, meaningful connections. It remains one of the most practical and influential self-help books ever written." 
    },

    // --- 5 CHILDREN BOOKS ---
    { 
        id: "child1", type: "Book", category: "Children", title: "The Carrot Seed", authorOrBrand: "Ruth Krauss", price: 295.0, stock: 30, totalSold: 1200, releaseDate: "1945-05-01", imageFile: "images/children/the-carrot-seed.jpg", 
        description: "A little boy plants a carrot seed and waits patiently for it to grow despite everyone's doubts. His mother, father, and older brother all warn him repeatedly that it simply won't come up. Undeterred by their skepticism, he carefully pulls the weeds and sprinkles the ground with water every single day. His unwavering faith and dedication serve as a beautiful lesson in perseverance and believing in oneself. Eventually, his patience is rewarded with a massive carrot that proves everyone wrong." 
    },
    { 
        id: "child2", type: "Book", category: "Children", title: "Shiloh", authorOrBrand: "Phyllis Reynolds Naylor", price: 355.0, stock: 25, totalSold: 3400, releaseDate: "1991-01-01", imageFile: "images/children/shiloh.jpg", 
        description: "An eleven-year-old boy named Marty finds an abused beagle near his home and instantly forms a deep bond with the animal. When he discovers the dog belongs to a cruel neighbor, Marty decides to hide Shiloh and risks everything to keep him safe. He builds a secret pen in the woods and goes to great lengths to feed and protect his new furry friend. This touching story forces Marty to navigate the difficult gray areas between right, wrong, and the law. It is a profound exploration of morality, responsibility, and unconditional love." 
    },
    { 
        id: "child3", type: "Book", category: "Children", title: "Peppa's Magical Unicorn", authorOrBrand: "Scholastic", price: 199.0, stock: 50, totalSold: 5000, releaseDate: "2018-12-26", imageFile: "images/children/peppa-pig.jpg", 
        description: "Peppa Pig and her friends are playing dress-up when Daddy Pig surprises them with a very special, magical guest. Peppa goes on a wonderful adventure with her new unicorn friend, exploring colorful landscapes and playing fun games. Along the way, Suzy Sheep and the rest of the playgroup join in on the sparkling, rainbow-filled excitement. This delightful tale is packed with the signature humor and charm that fans of the beloved animated series have come to expect. It is a fantastic, imagination-fueled story perfect for bedtime reading." 
    },
    { 
        id: "child4", type: "Book", category: "Children", title: "My Little Book of Fairy Stories", authorOrBrand: "Brown Watson", price: 245.0, stock: 40, totalSold: 2100, releaseDate: "2015-08-01", imageFile: "images/children/fairy-stories.jpg", 
        description: "This charming collection brings a variety of classic, timeless fairy tales to life for an entirely new generation of readers. Each beautifully crafted story is designed to transport children into magical realms filled with brave heroes, clever princesses, and mystical creatures. The vivid, full-color illustrations on every page help capture the imagination and keep young minds fully engaged. It features easy-to-read text that is perfect for early readers transitioning to chapter books or for parents reading aloud. This anthology is destined to become a treasured staple in any child's growing library." 
    },
    { 
        id: "child5", type: "Book", category: "Children", title: "A Wrinkle in Time", authorOrBrand: "Macmillan US", price: 425.0, stock: 60, totalSold: 8900, releaseDate: "1962-01-01", imageFile: "images/children/a-wrinkle-in-time.jpg", 
        description: "Meg Murry travels through space and time to rescue her missing scientist father from a dark, consuming force known as the Black Thing. Accompanied by her brilliant younger brother Charles Wallace and her friend Calvin, she embarks on a mind-bending journey across the universe. They are guided by three mysterious, celestial beings named Mrs. Whatsit, Mrs. Who, and Mrs. Which. Together, they must navigate strange worlds and confront the terrifying, conformist intelligence known only as IT. This thrilling sci-fi adventure captivates young minds while exploring deep philosophical concepts and the power of love." 
    },

    // --- 20 STATIONERY / SUPPLIES ---
    { 
        id: "stationery1", type: "Stationery", category: "Office Supplies", title: "Casio Scientific Calculator", authorOrBrand: "Casio", price: 1455.0, stock: 85, totalSold: 3200, releaseDate: "2021-07-25", imageFile: "images/stationery/casio-scientific-calculator-fx-991ex.jpg", 
        description: "This ClassWiz series scientific calculator features an intuitive high-resolution display and a powerful built-in spreadsheet function. It is meticulously designed to handle complex mathematical, statistical, and engineering calculations with absolute precision. The sleek, durable design makes it the perfect everyday companion for both high school and college engineering students." 
    },
    { 
        id: "stationery2", type: "Stationery", category: "Paper Supplies", title: "Cattleya Filler Notebook", authorOrBrand: "Cattleya", price: 35.0, stock: 500, totalSold: 8900, releaseDate: "2022-08-01", imageFile: "images/stationery/cattleya-filler-notebook.jpg", 
        description: "This is a standard 80-leaves spiral notebook bound with sturdy wire to prevent pages from tearing out easily. The bright, high-quality lined paper is incredibly smooth, preventing ink from bleeding through to the other side. It is the ideal, budget-friendly choice for organizing daily class notes and homework assignments." 
    },
    { 
        id: "stationery3", type: "Stationery", category: "Paper Supplies", title: "Clear Expanding Envelope", authorOrBrand: "Generic", price: 25.0, stock: 600, totalSold: 10800, releaseDate: "2023-01-05", imageFile: "images/stationery/clear-expanding-envelope-long.jpg", 
        description: "Keep your important academic and legal documents perfectly protected with this durable, translucent plastic envelope. It features an expandable gusset to hold thick stacks of paper and a secure push-lock closure to prevent spills. The clear design allows you to easily identify the contents without needing to open it." 
    },
    { 
        id: "stationery4", type: "Stationery", category: "Office Supplies", title: "Deli 2-Hole Puncher", authorOrBrand: "Deli", price: 155.0, stock: 90, totalSold: 1200, releaseDate: "2022-04-18", imageFile: "images/stationery/deli-2-hole-puncher.jpg", 
        description: "A heavy-duty, all-metal hole puncher built to withstand daily use in a busy office or classroom environment. It effortlessly punches perfectly aligned holes through thick stacks of documents in a single press. The base includes a convenient, easy-to-empty tray to catch all the paper confetti." 
    },
    { 
        id: "stationery5", type: "Stationery", category: "Office Supplies", title: "Elmer's Glue Stick 22g", authorOrBrand: "Elmer's", price: 65.0, stock: 220, totalSold: 2400, releaseDate: "2022-09-05", imageFile: "images/stationery/elmers-glue-stick.jpg", 
        description: "This classic, non-toxic glue stick applies smoothly without leaving behind messy clumps or wrinkles on your paper. The specialized no-run formula goes on purple so you can see exactly where you are applying it, but dries completely clear. It is entirely washable, making it incredibly safe and ideal for elementary school art projects." 
    },
    { 
        id: "stationery6", type: "Stationery", category: "Coloring Supplies", title: "Faber-Castell Color Pencils", authorOrBrand: "Faber-Castell", price: 285.0, stock: 110, totalSold: 1500, releaseDate: "2022-01-15", imageFile: "images/stationery/faber-castell-classic-color-pencils.jpg", 
        description: "Experience vibrant, rich color laydown with these premium, break-resistant color pencils. The specialized SV bonding process secures the lead entirely to the wood, preventing snapping during sharpening or heavy use. They are perfect for detailed school art projects, adult coloring books, and architectural sketching." 
    },
    { 
        id: "stationery7", type: "Stationery", category: "Writing Supplies", title: "Faber-Castell Yellow Highlighter", authorOrBrand: "Faber-Castell", price: 45.0, stock: 200, totalSold: 9600, releaseDate: "2023-02-10", imageFile: "images/stationery/faber-castell-yellow-highlighter.jpg", 
        description: "This super fluorescent yellow highlighter provides brilliant, unmissable emphasis for pinpointing crucial text. The chisel tip allows for both broad highlighting and fine underlining without smudging your pen ink. The large ink reservoir guarantees long-lasting performance throughout the entire academic semester." 
    },
    { 
        id: "stationery8", type: "Stationery", category: "Office Supplies", title: "Joy Stapler with Remover", authorOrBrand: "Joy", price: 85.0, stock: 160, totalSold: 2100, releaseDate: "2023-08-11", imageFile: "images/stationery/joy-stapler-with-remover.jpg", 
        description: "A highly reliable, standard #10 stapler featuring a comfortable, ergonomic grip for repetitive use. It includes a remarkably convenient, built-in staple remover at the back for quick corrections. Its compact size makes it a perfect fit for pencil cases, briefcases, and crowded office desks." 
    },
    { 
        id: "stationery9", type: "Stationery", category: "Office Supplies", title: "Maped Eraser (Pack of 2)", authorOrBrand: "Maped", price: 45.0, stock: 350, totalSold: 4100, releaseDate: "2022-11-20", imageFile: "images/stationery/maped-eraser.jpg", 
        description: "This high-quality, dust-free white eraser ensures your documents remain completely clean and professional. The unique formula rolls eraser shavings together, preventing messy dust from scattering across your workspace. It erases dark graphite cleanly without smudging or tearing thin paper." 
    },
    { 
        id: "stationery10", type: "Stationery", category: "Office Supplies", title: "Metal Binder Clips", authorOrBrand: "Generic", price: 45.0, stock: 400, totalSold: 8900, releaseDate: "2021-08-30", imageFile: "images/stationery/metal-binder-clips.jpg", 
        description: "These tempered steel binder clips provide an incredibly strong, unyielding grip for thick stacks of paper. The handles can be flipped up for hanging documents or folded completely flat for seamless filing. They are an absolute necessity for keeping heavy legal briefs and thick academic reports securely together." 
    },
    { 
        id: "stationery11", type: "Stationery", category: "Paper Supplies", title: "Moleskine Hardcover", authorOrBrand: "Moleskine", price: 1255.0, stock: 40, totalSold: 850, releaseDate: "2021-04-10", imageFile: "images/stationery/moleskine-classic-hardcover.jpg", 
        description: "A premium, elegantly designed hardcover journal featuring an elastic closure and an expandable inner pocket. The acid-free, ivory-colored dotted paper provides the perfect canvas for creative bullet journaling, sketching, or professional note-taking. It lays completely flat when open, offering a vastly superior and comfortable writing experience." 
    },
    { 
        id: "stationery12", type: "Stationery", category: "Paper Supplies", title: "Muji Cahier Journal", authorOrBrand: "Muji", price: 655.0, stock: 60, totalSold: 1100, releaseDate: "2022-10-12", imageFile: "images/stationery/muji-cahier-journal.jpg", 
        description: "This minimalist notebook embodies the classic Japanese aesthetic with its unbranded, understated cover design. It contains incredibly smooth, high-quality grid paper that prevents ghosting and feathering from gel pens. It is the perfect, lightweight companion for students and designers who appreciate clean, distraction-free stationery." 
    },
    { 
        id: "stationery13", type: "Stationery", category: "Writing Supplies", title: "Panda Ballpen Black", authorOrBrand: "Panda", price: 125.0, stock: 300, totalSold: 14200, releaseDate: "2023-01-01", imageFile: "images/stationery/panda-ballpen-black.jpg", 
        description: "These classic, widely beloved ballpoint pens are famous for their consistent and smooth ink flow. The sturdy tungsten carbide ball guarantees completely skip-free writing across all types of paper surfaces. They are the ultimate, reliable choice for everyday office tasks and fast-paced university lectures." 
    },
    { 
        id: "stationery14", type: "Stationery", category: "Writing Supplies", title: "Pentel Energel 0.5mm Blue", authorOrBrand: "Pentel", price: 75.0, stock: 90, totalSold: 1800, releaseDate: "2023-06-20", imageFile: "images/stationery/pentel-engergel-blue.jpg", 
        description: "Experience incredibly smooth, effortless writing with this high-performance liquid gel pen. The advanced, quick-drying ink technology completely eliminates smears and smudges, making it an absolute favorite among left-handed writers. The 0.5mm needle tip provides crisp, clean lines perfect for detailed planners and professional documents." 
    },
    { 
        id: "stationery15", type: "Stationery", category: "Writing Supplies", title: "Pilot G-Tec C4 Black", authorOrBrand: "Pilot", price: 65.0, stock: 150, totalSold: 3400, releaseDate: "2022-05-15", imageFile: "images/stationery/pilot-g-tec-pen.jpg", 
        description: "This iconic gel pen features an ultra-fine 0.4mm micro-tip engineered for absolute precision and detailing. The uniquely formulated bio-polymer ink prevents feathering, ensuring your tiny text and intricate drawings remain razor-sharp. It is highly recommended for accounting ledgers, margin notes, and architectural drafting." 
    },
    { 
        id: "stationery16", type: "Stationery", category: "Office Supplies", title: "Post-it Notes 3x3", authorOrBrand: "3M", price: 75.0, stock: 280, totalSold: 11500, releaseDate: "2021-06-14", imageFile: "images/stationery/post-it-notes.jpg", 
        description: "These standard 3x3 inch sticky notes are an essential tool for organizing your workspace and leaving quick reminders. Each pad contains 100 sheets featuring a reliable adhesive that sticks securely but removes cleanly without damaging paper. They are perfect for brainstorming sessions, indexing textbooks, or leaving messages on monitors and desks." 
    },
    { 
        id: "stationery17", type: "Stationery", category: "Coloring Supplies", title: "Prang Watercolors 8 Colors", authorOrBrand: "Prang", price: 195.0, stock: 75, totalSold: 900, releaseDate: "2023-05-10", imageFile: "images/stationery/prang-watercolors-8-colors.jpg", 
        description: "This classic, semi-moist watercolor set delivers incredibly intense, highly pigmented colors right out of the pan. The set comes enclosed in a durable plastic case and includes a fine-quality wooden paintbrush. The non-toxic, easily washable paints make this an excellent choice for elementary art classes and hobbyists alike." 
    },
    { 
        id: "stationery18", type: "Stationery", category: "Office Supplies", title: "Scotch Magic Tape", authorOrBrand: "3M", price: 115.0, stock: 140, totalSold: 1800, releaseDate: "2021-03-22", imageFile: "images/stationery/scotch-magic-tape-with-dispenser.jpg", 
        description: "This premium, original matte-finish tape turns practically invisible when applied to standard paper and documents. You can easily write directly on the tape with pen, pencil, or marker without any smearing. The convenient, handheld dispenser allows for quick, clean tearing, making it essential for gift wrapping and document repair." 
    },
    { 
        id: "stationery19", type: "Stationery", category: "Writing Supplies", title: "Sharpie Marker Black", authorOrBrand: "Sharpie", price: 55.0, stock: 120, totalSold: 2100, releaseDate: "2021-11-05", imageFile: "images/stationery/sharpie-permanent-marker-black.jpg", 
        description: "The industry standard for permanent markers, delivering incredibly bold, highly visible black ink that stands the test of time. The durable fine point tip allows for precision marking on almost any surface, including plastic, glass, and metal. The quick-drying, water-resistant ink ensures your important labels and artistic lines will never fade." 
    },
    { 
        id: "stationery20", type: "Stationery", category: "Paper Supplies", title: "Veco Yellow Pad Paper", authorOrBrand: "Veco", price: 45.0, stock: 450, totalSold: 13800, releaseDate: "2023-03-01", imageFile: "images/stationery/veco-yellow-pad-paper.jpg", 
        description: "A high-quality, standard legal pad featuring 90 leaves of smooth, easy-to-read yellow paper with distinct blue rulings. The sturdy cardboard backing provides a firm, reliable writing surface even when you are away from your desk. It is a fundamental supply for law students, busy professionals, and rapid meeting dictation." 
    }
];