import { config } from "dotenv";

config({ path: ".env.local" });

import { MongoClient } from "mongodb";
import type {
  PastCouncil,
  PastPresident,
  PresidentMessage,
} from "../src/lib/types";

const CURRENT_PRESIDENT: PresidentMessage = {
  slug: "dr-nayana-samarasinghe",
  name: "Dr Nayana Samarasinghe",
  image: "/images/president.png",
  tenure: "2026 – 2027",
  excerpt:
    "It is with great pride and honour that I welcome you to the official website of the Sri Lanka College of Radiologists. As President, I am privileged to represent a professional body that has consistently upheld excellence in radiology practice, education and research within our nation.",
  body: [
    "It is with great pride and honour that I welcome you to the official website of the Sri Lanka College of Radiologists. As President, I am privileged to represent a professional body that has consistently upheld excellence in radiology practice, education and research within our nation.",
    "Radiology continues to be at the forefront of modern medicine-guiding diagnosis, influencing therapeutic decisions and shaping the future of patient care. In Sri Lanka, our radiologists remain committed to embracing technical advancements, strengthening subspeciality expertise and maintaining the highest standards of ethical and professional conduct.",
    "The college remains steadfast in its mission to promote continuous professional development, academic excellence and collaborative engagement both locally and internationally. Through scientific meetings, workshops, training programmes and research initiatives we strive to empower our members including trainees to meet demands of contemporary healthcare.",
    "This year marks a particularly significant milestone in our journey - the Silver Jubilee Annual Academic Sessions of the college. Celebrating twenty-five years of dedication to academic advancement and professional unity, this land mark event reflects the remarkable growth and achievements of our college since its inception. The Silver Jubilee Meeting will bring together distinguished local and international faculty, showcase cutting-edge developments in diagnostic and interventional radiology, and provide a vibrant platform for knowledge exchange and scientific discourse.",
    "More importantly this celebration is not only reflection of our past accomplishments but also a reaffirmation of our vision of the future - nurturing the next generation of radiologists strengthening research culture and fostering global partnerships.",
    "I warmly invite all members and trainees to actively participate in this historic event and contribute to making the Silver Jubilee Academic Sessions a memorable and academically enriching experience which will be held on 18th, 19th and 20th of September 2026 at Cinnamon Grand Colombo, Sri Lanka.",
    "As we move forward, let us continue to work together with unity, innovation and commitment to excellence in service of our patients and our profession.",
  ],
  createdAt: new Date("2026-01-01T00:00:00Z"),
};

const PAST_MESSAGES: PresidentMessage[] = [
  {
    slug: "prof-harsha-dissanayake",
    name: "Prof Harsha Dissanayake",
    image: "/images/prof_harsha_dissanayake-300x300.jpg",
    tenure: "2024 – 2025",
    excerpt:
      "I am honored, and deeply humbled, to be elected as the President of the Sri Lanka College of Radiologists, for the year 2024. I thank the members, for the confidence...",
    body: [
      "I am honored, and deeply humbled, to be elected as the President of the Sri Lanka College of Radiologists, for the year 2024.",
      "I thank the members, for the confidence and the trust you have placed in me, to steer the College in the coming year.",
      "I will do my best to fulfill the expectations of the membership.",
      "It is certainly not an easy task, but I am confident, that with the support of the council and all the members, we will be able to meet the challenges.",
      "I am grateful to the past presidents, executive councils and all the members for the hard work done to bring our college to the present status.",
      "As our theme for the year 2024, we have chosen \"Advances in Medical Imaging in the Digital era: Opportunities and Challenges.\"",
      "When we consider the opportunities, new technologies play a pivotal role, improving diagnostics with the use of AI and multimodal imaging.",
      "Subspecialties like neuroradiology, paediatric radiology and interventional radiology will come to the forefront with rapid advances and further new subspecialties will be developed.",
      "At the same time the challenges will include increasing costs and dilemmas in resource allocation.  Work force training and education and ethical considerations should also be considered.",
      "Younger generation of radiologists will have to play a lead role in this process.",
      "Vision for the College is rooted in fostering collaboration.",
      "I believe that by harnessing the collective acumen and expertise of our members, we can push the boundaries of patient care, research and education in the field of Radiology in Sri Lanka.",
      "Education lies at the heart of our mission. I am committed to working collaboratively with other colleges, academic institutions, healthcare professionals, and policymakers.",
      "I envision engaging in outreach programs, collaborating with the media, and utilizing digital platforms to share our knowledge and inspire curiosity about the intricacies of Radiology and imaging.",
      "I would be happy to establish international collaborations, strengthening the existing bonds, creating opportunities for our members to engage with global Radiology communities, and bringing international expertise to our local forums.",
      "From the inception, the SLCR has steadily grown to where we are today. I urge, that we, should keep the momentum, work together with a vision, to take our college to greater heights.",
      "In keeping up with the objectives of the college, to develop collaborations, promote research and advance the knowledge and understanding in Radiological sciences, we hope to hold the Annual Scientific Sessions in October this year.",
      "We will have regular clinical meetings to upgrade the knowledge and to keep the membership up-to-date.",
      "Sri Lanka Journal of Radiology, the official journal of the SLCR, is a peer reviewed journal, published bi-annually in the Sri Lanka online Journal Platform. I extend my sincere thanks to our editors and the team for the good work.",
      "I would invite all the members and the trainees to send in their quality research findings to our own journal to be published.",
      "We would also be thinking of work life balance and there will be events for collegiality and relaxation with social interactions in the coming year.",
      "All these programs will be successful, with the support and dedication of each and every member of the college and as the newly elected president, I earnestly request your corporation and support towards achieving these goals.",
      "Thank you,",
      "Prof. Harsha Dissanayake",
      "President – Sri Lanka College of Radiologists – 2024",
    ],
    createdAt: new Date("2024-01-01T00:00:00Z"),
  },
  {
    slug: "dr-shantha-hettiarachchi",
    name: "Dr Shantha Hettiarachchi",
    image: "/images/shantha_hettiarachchi-138x150.jpg",
    tenure: "2023 – 2024",
    excerpt:
      "It is with great pleasure and sincere gratitude that I pen this message to you as the president of the Sri Lankan College of Radiologists for the year...",
    body: [
      "It is with great pleasure and sincere gratitude that I pen this message to you as the president of the Sri Lankan College of Radiologists for the year 2023/2024. I hope to honor the trust placed in me and carry out the responsibilities of the role, striving for better radiology services in the country.",
      "There are plenty of opportunities and challenges awaiting us in the months to come, and I am confident that the newly appointed council will rise to the occasion and surpass expectations each time.",
      "When we consider the broad umbrella of medial studies and specialisation, radiology is seen as one of the most utilised segments of the medical paternity. Radiological information and expertise is used within many clinical fields, fields that have taken the initiative to sub-specialize in the recent past. With the intention of keeping pace with ever changing medical advancements, it is my belief that encouraging and initiating sub-specialities within the field of radiology is the next big step for us as a community. While interventional radiology, paediatric radiology, and neuroradiology have already been identified and included in the training program, we hope to introduce musculoskeletal radiology and women's imaging as two new sub-specialities to be explored.",
      "I implore all within the community to encourage sub-specialization to juniors and budding radiologists in order to provide for the demand the future will bring.",
      "I would like to make mention of the evolution of artificial intelligence and its influence on the recent advancements in radiology. Artificial intelligence provides opportunity for radiology departments to not only improve, but also standardise reports on radiological investigations, and various aspects of management.",
      "The theme for the 2024 annual academic sessions, to be held in January, is \"Advances in body imaging for better patient care\". Advances in breast imaging will be discussed at a pre-congress workshop, while many foreign and local speakers will share their knowledge over the course of the academics sessions. I encourage all who are able, to be present at the event. The experience will prove to be worth it.",
      "I humbly invite all members of the SLCR to join hands with the new council and each other, so that we may all put our best foot forward for the future of radiology in Sri Lanka.",
    ],
    createdAt: new Date("2023-01-01T00:00:00Z"),
  },
  {
    slug: "dr-wa-dileep-karunaratne",
    name: "Dr. W. A. Dileep Karunaratne",
    image: "/images/dr_wa_dileep_karunaratne-1-150x150.jpg",
    tenure: "2022 – 2023",
    excerpt:
      "It is with utmost humility that I pen this message as the 29th president of Sri Lanka College of Radiologists...",
    body: [
      "It is with utmost humility that I pen this message as the 29th president of Sri Lanka College of Radiologists. I have chosen the theme \"Work together to Enlighten the field of Radiology.\" for this year. Sri Lanka College of Radiologists started its journey in 1980 and had been through ups and downs during a long history of 42 years to 2022. Our membership has increased from 07 to 324 by now. During the past 42 years, 28 presidents have done immense work to develop the field of Radiology and to achieve recognition in national and international levels. I make this an opportunity to thank and express gratitude to all the past presidents who have gone through many hardships for the betterment of the Radiology field.",
      "In 2022, we are hopefully recovering from the COVID pandemic which affected the whole world and made all the societies like ours having difficulties. It is a challenging time to all the fields including Radiology. So, we have to work hard to build up ourselves to achieve our current targets.",
      "As you all know, the fastest developing field of medicine is Radiology because of the rapid development of medical technology. All the fields of medicine are greatly depended upon imaging which means diagnostic and the therapeutic Radiology. I feel humbly proud to be a member of esteemed team. It is mandatory to maintain international standards to achieve the confidence of our colleagues, referring clinicians for which we must update our knowledge and skills. Continuous Medical Education plays a major role in improving our knowledge and skills. So, my council and I have already planned to perform many academic events throughout the year and our major academic event, the annual academic sessions at the end of my tenure.",
      "I believe that it is a requirement, responsibility and obligation of all the members and trainees to participate in all the academic events and gather the knowledge and skills to provide good quality Radiological services to our community.",
      "Though many past presidents have already emphasized, attempted and succeeded to introduce the sub specialties to our field, there is more work to be done by me and my council. I will strongly hope to work on developing sub specialties during my year.",
      "As a Radiologist who has worked hard for 17 long years in various parts of the country, I know the problems faced by peripheral Radiologists better, mainly the lack of basic required Radiological equipment. I will try to encourage the ministry of Health on this matter though the financial crisis existing in the country that will make it difficult.",
      "Other major problem in the field of Radiology is the maldistribution of Radiologists to appropriate stations and needy stations. My council and I will work to regularize the annual transfers and end post advertisements according to the needs of the country.",
      "Finally, though I have big hopes operations to be in progress, no one can't do miracles and can't do anything alone. So, I humbly request all council members, all colleagues and teachers to help me and let's work together to achieve at least majority of our targets. I wish you good luck, a happy and prosperous future.",
      "Thank you",
      "Dr. W. A. Dileep Karunaratne",
      "The President- Sri Lanka College of Radiologists",
      "Consultant Radiologist",
      "Email – drdileep2003@gmail.com",
    ],
    createdAt: new Date("2022-01-01T00:00:00Z"),
  },
  {
    slug: "dr-jerrard-fernando",
    name: "Dr. Jerrard Fernando",
    image: "/images/Dr_m_u_j_fernando.jpg",
    tenure: "2020 – 2021",
    excerpt:
      "I am honored to be elected as the 17th President of the Sri Lanka College of Radiologists for the year 2021...",
    body: [
      "I am honored to be elected as the 17th President of the Sri Lanka College of Radiologists for the year 2021.",
      "It is a challenging time for field of Radiology in Sri Lanka. Due to the vast strides in the technical and computer fields, Imaging has become the fastest growing field in medicine. Imaging methods improve and surpass the previous methods every year. Across all medical fields, diagnostic imaging has become the cornerstone of patient management.",
      "As the dependency on imaging grows , more and more clinicians are learning to interpret imaging, this is more so in the fields of subspecialties. If we are to cater to the growing need of imaging, we need to provide the services on time, need to be available for the clinicians, and we have to be on par with knowledge of even the sub specialty clinicians.",
      "Hence a definite need of the time for Sri Lankan radiology is the sub specialties. We already have Neuro radiology, Interventional and Pediatric Radiology as recognized subspecialties in Sri Lanka. We need to expand this further to include Cardiothoracic, Musculoskeletal, Women's Imaging, Oncology and Emergency Imaging if we are to stop transgression of others in to our field, and we need to do this urgently. College of Radiologist plan to advocate this essential matter during the coming year.",
      "Our field is equipment based. Some our Radiologists in the peripheries still have to borrow the USS of other clinicians. Together with my council I hope to convince the Ministry of Health to provide the every Radiologists with at least a good high end Ultra Sound Scanner.",
      "Continuous medical education is an essential part of SLCR activity.",
      "I hope to conduct at least one clinical meeting , virtual or physical, every other month. Our own young radiologists need to be given the opportunity to sharpen their skills at presentations and I hope that they will come forward to share their knowledge with the radiology community of Sri Lanka. The knowledge thus gained should translate to excellent patient care by practicing radiologists.",
      "Through all these we need to project the Radiologists as patient's imaging physician.",
      "We need to encourage the publishing of research and articles in our own Radiology Journal. I would like to thank the Editors, present and past for their untiring efforts to continue the Journal in these trying times. We are members of a specialty with amazing and unparalleled opportunities for clinical care, education, and scientific advancement.",
      "I encourage all Radiologists, and Trainees specially the young radiologists, to join SLCR to advance our specialty through out our mother land for the the benefit of our patients.",
      "Thank you",
      "The President- Sri Lanka College of Radiologists",
      "Dr. Jerrard Fernando",
      "Email – jerrardf@gmail.com",
    ],
    createdAt: new Date("2021-01-01T00:00:00Z"),
  },
  {
    slug: "dr-pandula-hettiarachchi-2019-2020",
    name: "Dr. Pandula Hettiarachchi (2019 – 2020)",
    image: "/images/Dr-Pandula-Hettiarachchi-150x150.jpg",
    tenure: "2019 – 2020",
    excerpt:
      "It is with great honor that I commence my incumbency as the President of the Sri Lanka College of Radiologists for the term 2019/20...",
    body: [
      "It is with great honor that I commence my incumbency as the President of the Sri Lanka College of Radiologists for the term 2019/20. I would briefly highlight the areas that SLCR concerns for the interest of the membership during my tenure.",
      "The College belongs to the members and therefore it nurtures upon productive ideas and wishes of the membership. Members, especially those serving in the peripheries under the ministry of health, have brought in a vast amount of strength to our college over the years, making it one of the strongest academic bodies in the medical field. I would certainly be successful in my endeavor if I can make those ideas matter more.",
      "As we all served in peripheries, we know the importance of smooth transfer system for everyone to enjoy. I strongly deny any attempt leading to alter the current service minutes of ministry of health, for personal benefits, especially in terms of transfers.",
      "I firmly believe, that the college must take the initiative to help its members to see beyond the scope of general radiology and be armed with the knowledge of a subspecialty of their choice in par with the country's existing system.",
      "Having an interest in a subspecialty is a must for any Radiologist where ever they practice and it should not be a privilege limited for a few.",
      "Members should be encouraged in radiology research and audits in addition to day to day imaging and report writing. Today's research will become tomorrow's practice and audit will shape our evidence based practice.",
      "Technical innovations and information technology specially picture archiving and communication system, PACS have revolutionized the field of radiology and elevated the radiologist to the highest position in the multi-disciplinary team providing patient care.",
      "Artificial intelligence( AI )is the next level of state of art in radiology which predict on the diagnosis as well. Some says the role of the Radiologist should be obsolete in the next few years with AI.",
      "There is no way AI can replace the radiologists. Radiologists who use AI will likely surpass radiologists who don't, So it's up to you to decide whether to master the technology or be a victim to the AI.",
      "We as the council of Sri Lanka College of Radiologists will be dedicated to organize academic events during the year to achieve above goals for the benefit of our members and members to be. We hope you would continue to be with us, helping and guiding us for the betterment of radiology in our country.",
      "Thank you",
      "The President- Sri Lanka College of Radiologists",
      "Dr. Pandula Hettiararchchi",
      "Email – pandula69@icloud.com",
    ],
    createdAt: new Date("2019-01-01T00:00:00Z"),
  },
  {
    slug: "dr-prasad-de-silva-2018-2019",
    name: "Dr. Prasad De Silva (2018 – 2019)",
    image: "/images/Dr.-Prasad-De-Silva-1-768x1024-1-138x150.jpg",
    tenure: "2018 – 2019",
    excerpt:
      "It is with great humility that I commence my tenure as the President of the Sri Lanka College of Radiologists for the term 2018/19...",
    body: [
      "It is with great humility that I commence my tenure as the President of the Sri Lanka College of Radiologists for the term 2018/19.",
      "The College, as we know belongs to the members and therefore it nurtures upon wishes of the membership.",
      "Members, specially those serving in the periphery, have brought in a vast amount of strength to our college in silence over the years, making it one of the strongest academic bodies in the medical field. I would definitely be successful in my endeavor if I can make those silent ideas heard and matter more.",
      "I firmly believe, the College must take the initiative to help its members to see beyond the scope of general radiology and be armed with the knowledge of a subspecialty of their choice, which is the current international norm. Having an interest in a subspecialty is a must for any radiologist where ever they practice and it should not be a privilege limited for a few.",
      "Members should be encouraged in radiology research and audits in addition to day to day imaging and report writing. Todays research will become tomorrow's practice and audit will shape our evidence based practice.",
      "Technical innovations and information technology specially PACS has revolutionized radiology and elevated the radiologist to the highest position in the multidisciplinary team providing patient care.",
      "We as the council of Sri Lanka College of Radiologists will be dedicated to organize academic events during the year to achieve above goals for the benefit our members and members to be. We hope you would continue to be with us, helping and guiding us for the betterment of radiology in our country.",
      "Thank you",
      "The President- Sri Lanka College of Radiologists",
      "Dr. Prasad De Silva",
    ],
    createdAt: new Date("2018-01-01T00:00:00Z"),
  },
  {
    slug: "dr-as-pallewatte-2017-2018",
    name: "Dr. A.S Pallewatte (2017-2018)",
    image: "/images/DrASPallewatte-138x150.jpg",
    tenure: "2017 – 2018",
    excerpt:
      "It is with great humility that I commence my tenure as the President of the Sri Lanka College of Radiologists for the term 2017/18...",
    body: [
      "It is with great humility that I commence my tenure as the President of the Sri Lanka College of Radiologists for the term 2017/18.",
      "The College, as we know belongs to the members and therefore it nurtures upon wishes of the membership.",
      "Members, specially those serving in the periphery, have brought in a vast amount of strength to our college in silence over the years, making it one of the strongest academic bodies in the medical field. I would definitely be successful in my endeavor if I can make those silent ideas heard and matter more.",
      "I firmly believe, the College must take the initiative to help its members to see beyond the scope of general radiology and be armed with the knowledge of a subspeciality of their choice, which is the current international norm. Having an interest in a subspeciality is a must for any radiologist where ever they practice and it should not be a limited privilege.",
      "Members should be encouraged in radiology research and audits in addition to day to day imaging and report writing. Todays research will become tomorrows practice and audit will shape our evidence based practice.",
      "Technical innovations and information technology specially PACS has revolutionalized radiology and elevated radiologists' position in multidisciplinary patient based care.",
      "We as the council of Sri Lanka College of Radiologists will be dedicated to organize academic events during the year to achieve above goals for the benefit our members and members to be. We hope you would continue to be with us, helping and guiding us for the betterment of radiology in our country.",
      "It is with great humility that I commence my tenure as the President of the Sri Lanka College of Radiologists for the term 2017/18. The College, as we know belongs to the members and therefore it nurtures upon wishes of the membership. Members, specially those serving in the periphery, have brought in a vast amount of strength to our college in silence, over the years making it one of the strongest academic bodies in the medical field. I would definitely be successful in my endeavor if I can make those silent ideas heard and matter more.",
      "I believe College must take the initiative to help our radiologists to see further beyond images in their practice and be updated with ever advancing subspecialty knowledge which is the current international norm. Having a subspeciality interest is a must of any radiologist where ever they practice and it should not be a limited privilege.",
      "Next point we must reach beyond just imaging is in radiology research and audit. Todays research will become tomorrows practice and audit will shape our evidence based practice.",
      "Technical innovations and information technology specially PACS has revolutionalized radiology practice and straightened radiologists' position in multidisciplinary patient based care.",
      "We as the council of Sri Lanka College of Radiologists will be dedicated organize academic events during the year try achieve above goals for the benefit our members and members to be. We hope you would continue to be with us, helping us and guiding us in serving our field.",
      "Thank you",
      "Dr. Aruna Pallewatte MBBS, MD, FRCR (Lond),",
      "Consultant Radiologist,",
      "Neuroradiology and MRI Section",
      "National Hospital of Sri Lanka",
    ],
    createdAt: new Date("2017-01-01T00:00:00Z"),
  },
  {
    slug: "dr-shanthini-rosairo-2016-2017",
    name: "Dr. Shanthini Rosairo (2016 – 2017)",
    image: "/images/Dr-Shanthini-Rosairo-138x150.jpg",
    tenure: "2016 – 2017",
    excerpt:
      "As the President of the Sri Lanka College of Radiologists, it is my privilege and honour to issue this message...",
    body: [
      "As the President of the Sri Lanka College of Radiologists, it is my privilege and honour to issue this message.",
      "It is with great humility that I accept the post of President, Sri Lanka College of Radiologists for the term 2016-2017. It is indeed an honor and privilege to be the President of this prestigious association. I have been a member of Sri Lanka College of Radiologists since 1994 and witnessed many changes and advancement in the field of Radiology over the years. I have seen the Sri Lanka College of Radiologists grow under the guidance of strong leadership and dedicated members. I am grateful to those past Presidents and Executive Council members who have worked hard and sacrificed personal resources towards making the Sri Lanka College of Radiologists, the strong, successful organization that it is today.",
      "Though we are a strong and well established College much remains to be done. It's time to take the College to the next level during this phase of health care challenges and changes, by making our relevance known to our stakeholders and most importantly to our patients. The theme I selected for the year is \"Achieving excellence in delivery of Radiological care\". The plan for the year is to develop close cooperation among the members, provide useful and up-to-date information through the web site, address the needs of the junior members of the college, organize educational programs across the country, appoint subcommittees to look into the needs of the membership, expand and maintain radiological services to the patients and medical community and ultimately build the reputation of the field of Radiology. The highlight of the academic activities, the Annual academic sessions of 2017 would be held in Kandy from August 31st to September 2nd and I am certain that you would find it an educational as well as an enjoyable experience.",
      "As I assume this role, I must mention my gratitude, trust and belief in the members of the new Council, a group of persons with exceptional aptitude and a sense of service who have volunteered for this purpose. I look forward to working with each one of them. However in order to achieve our goals I need the contribution of all the members of the College. Therefore I hope you all will join with me in this mission. If you have ideas, suggestions or questions you are most welcome to express them. Please don't hesitate to communicate to me anything which would be for the betterment of the college.",
      "I hope this will be an active and exciting year for the Sri Lanka College of Radiologists. Once again, I am grateful and honoured to have the opportunity to serve as President of this prestigious organization. In my efforts I will hold true to the mission of the association, and look forward, to your fullest cooperation and commitment.",
      "Thank you",
      "The President- Sri Lanka College of Radiologists",
      "Dr. Shanthini Rosairo",
    ],
    createdAt: new Date("2016-01-01T00:00:00Z"),
  },
  {
    slug: "dr-dj-wickramarathna-2015-2016",
    name: "Dr. D.J. Wickramarathna (2015 – 2016)",
    image: "/images/Dr.-D.J.-Wickramarathna-138x150.jpg",
    tenure: "2015 – 2016",
    excerpt:
      "As the President of the Sri Lanka College of Radiologists, it is my privilege and honour to issue this message. The SLCR...",
    body: [
      "As the President of the Sri Lanka College of Radiologists, it is my privilege and honour to issue this message.",
      "The SLCR is the pioneer professional body in responsible for the maintenance and improvement of the clinical radiology services and standards in the country. Founded in January 1981 under the auspices of Dr S N B T Talwatta, SLRC held its inaugural academic sessions in 2002. I have been a member of the SLCR since 1985 and had the honour of being the Vice President at its inaugural academic sessions in 2002.",
      "Thirty years since the inception of SLRC, our main goal of providing utmost care for the patient through our mandate remains unchanged. Our final aim is to provide scientifically sound, advance, ethical and equitable care to all our patients, using cutting edge technology in diagnostic and therapeutic imaging. The present high standards of the SLCR is a result of the commitment of its past presidents committee members and the membership.",
      "I am blessed with a great team of competent and accomplished council members with whom I have planned a whole year of educational and professional events, commencing with the International Radiology Day cerebration in November 2015.",
      "SLRC has so far done a great deal of work in collaboration with the PGIM to formulate guide lines for establishing Pediatric, Neuro, Interventional and Nuclear Medicine subspecialties with a wider vision to the future requirements of the country. It is with immense pleasure that I inform that Pediatric- radiology is now recognized as a new subspecialty by the Post Graduate Institute of Medicine in Sri Lanka and it will be offered to the candidates sitting for MD-Radiology part II from this year. I wish to thank Dr (Mrs.) I N A Goonaratne and Dr (Mrs.) K Pathirana for their unstinted support for establishing this new subspecialty. Further, the Council of SLCR is presently working in close collaboration with the Ministry of Health and PGIM to establish the Neuro-radiology and Interventional-radiology sub specialties in Sri Lanka and hope to offer these two sub specialties to the MD-Radiology part II candidates in 2016.",
      "The much awaited grand academic event of the year, the 15th Annual Academic Sessions will be held from 2nd to 4th of September 2016 at the Hotel Galadari, Colombo where we hope to benefit from the synergy brought to this exciting event by local and international resource persons and participants. Special Focus will be placed on the future of our specialty- the residents of Radiology and the early career professionals. Their engagement reinforces SLCR's strength as the national voice of Sri Lankan Radiologists. One of our main goals this year is the successful fulfillment of the work we undertake on their behalf that will result in strengthening their academic and professional skills to empower them to push new frontiers.",
      "It is my fervent hope that the SLCR will continue to receive the support of all its membership and well-wishers in its future academic endeavors, especially at the Annual Academic Sessions where a vibrant exchange of knowledge and ideas will occur, enhancing our reputation as a professional body.",
      "I would like to extend my sincere thanks to the membership of SLCR for their commitment, support and solidarity to uphold the mandate of our professional association.",
      "Thank you",
      "The President- Sri Lanka College of Radiologists",
      "Dr. D.J. Wickramarathna",
    ],
    createdAt: new Date("2015-01-01T00:00:00Z"),
  },
];

const PAST_PRESIDENTS: Omit<PastPresident, "order">[] = [
  { name: "Dr. S.N.B.Talwatte", image: "/images/past-presidents/Dr.-S.N.B.Talwatte.jpg" },
  { name: "Dr. A.W.Atukorale", image: "/images/past-presidents/Dr.-A.W.Atukorale.jpg" },
  { name: "Dr. K.M.C.De Silva", image: "/images/past-presidents/Dr.-K.M.C.De-Silva.jpg" },
  { name: "Dr. (Mrs.) P.Amarasinghe", image: "/images/past-presidents/Dr.-Mrs-P.Amarasinghe-1.jpg" },
  { name: "Dr. N.Jayaratne", image: "/images/past-presidents/Dr.-N.Jayaratne.jpg" },
  { name: "Dr. D.D.A Jayamanne", image: "/images/past-presidents/Dr.-D.D.A-Jayamanne.jpg" },
  { name: "Dr. (Mrs.) U. Weerasinghe", image: "/images/past-presidents/Dr.-Mrs-U.Weerasinghe-1.jpg" },
  { name: "Dr. Thureirajah", term: "1999 – 2000", image: "/images/past-presidents/Dr.-Thureirajah.jpg" },
  { name: "Dr. (Mrs.) G.Subasinghe", term: "2000 – 2002", image: "/images/past-presidents/Dr.-Mrs-G.Subasinghe.jpg" },
  { name: "Dr. (Mrs.) I. N. A. Gunarathne", term: "2002 – 2003", image: "/images/past-presidents/Dr.-Mrs.-I.-N.-A.-Gunarathne.jpg" },
  { name: "Dr. (Mrs.) K.Pathirane", term: "2003 – 2004", image: "/images/past-presidents/Dr.-Mrs-K.Pathirane.jpg" },
  { name: "Dr. (Mrs.) N. Somaweera", term: "2004 - 2005", image: "/images/past-presidents/Dr.-Mrs.-N.-Somaweera.jpg" },
  { name: "Dr. S. V. Alahakoon", term: "2005 – 2006", image: "/images/past-presidents/Dr.-S.-V.-Alahakoon.jpg" },
  { name: "Dr. N.G. Atulugama", term: "2006 – 2007" },
  { name: "Dr. I. N. Lekamge", term: "2007 - 2008", image: "/images/past-presidents/Dr.-I.-N.-LEKAMGE.jpg" },
  { name: "Dr. P.B. Hewavithana", term: "2008 - 2009", image: "/images/past-presidents/Dr.P.B.Hewavithana.jpg" },
  { name: "Dr. (Mrs.) Rajapaksha", term: "2009 – 2010", image: "/images/past-presidents/Dr-Mrs-T.G.T.Rajapaksha.jpg" },
  { name: "Dr. U Samarasinghe", term: "2010 – 2011", image: "/images/past-presidents/Dr.-Usaha-Samarasinghe.jpg" },
  { name: "Maj. Gen. (Dr.) S.H.Munasinghe", term: "2011 – 2012", image: "/images/past-presidents/Dr.-S.H.-Munasinghe-.jpg" },
  { name: "Brig. (Dr.) D.T.N. Munasinghe", term: "2012 – 2013", image: "/images/past-presidents/Brig.-Dr-D.T.N.Munasinghe.jpg" },
  { name: "Dr. K. Samarawickrama", term: "2013 – 2014", image: "/images/past-presidents/Dr.K.Samarawickrama.jpg" },
  { name: "Dr. Chandra Sirigampala", term: "2014 - 2015", image: "/images/past-presidents/Dr.-Chandra-Sirigampala-1.jpg" },
  { name: "Dr. Wickramarathna", term: "2015 – 2016", image: "/images/past-presidents/Dr.-D.J.-Wickramarathna.jpg" },
  { name: "Dr. Shanthini Rosairo", term: "2016 – 2017", image: "/images/past-presidents/Dr-Shanthini-Rosairo.jpg" },
  { name: "Dr. A.S Pallewatte", term: "2017 - 2018", image: "/images/past-presidents/DrASPallewatte.jpg" },
  { name: "Dr. Prasad De Silva", term: "2018 - 2019", image: "/images/past-presidents/Dr.-Prasad-De-Silva-1-768x1024-1.jpg" },
  { name: "Dr. Pandula Hettiarachchi", term: "2019 - 2020", image: "/images/past-presidents/Dr-Pandula-Hettiarachchi_pp.jpg" },
  { name: "Dr. Jerrard Fernando", term: "2019 - 2020", image: "/images/past-presidents/dr_jerrad_fernando.jpg" },
  { name: "Dr. W. A. Dileep Karunaratne", term: "2022 - 2023", image: "/images/dr_wa_dileep_karunaratne-1-150x150.jpg" },
  { name: "Dr. Shantha Hettiarachchi", term: "2023 - 2024", image: "/images/past-presidents/shantha_hettiarachchi.jpg" },
  { name: "Prof Harsha Dissanayake", term: "2024 - 2025", image: "/images/past-presidents/prof_harsha_dissanayake.jpg" },
  { name: "Dr. Sheahan Waas", term: "2025 - 2026", image: "/images/past-presidents/Dr-Sheahan-Waas.jpg" },
];

const PAST_COUNCILS: PastCouncil[] = [
  {
    title: "Council Members 2025/2026",
    year: 2025,
    leaders: [
      { name: "Dr Sheahan Waas (President)" },
      { name: "Dr. Nayana Samarasinghe (President Elect)", email: "nsamar@hotmail.com" },
      { name: "Dr Sashika Alahakoon (Hon. Secretary)" },
      { name: "Dr K M R Kannangara (Asst. Secretary – Academic )", email: "rupakannangara@ymail.com" },
      { name: "Dr Induni Douglas (Asst. Secretary – Social )" },
      { name: "Dr Wasantha Sathkorala (Hon. Treasurer)", email: "wasanthawk@yahoo.com" },
      { name: "Dr. W Meegoda (Asst. Treasurer)", email: "wmeegoda@gmail.com" },
      { name: "Prof Harsha Dissanayake (Past President)", email: "harshadis@sjp.ac.lk" },
    ],
    members: [
      { name: "Dr Buddhi Abeywickrama" },
      { name: "Dr Sumedha Kumanayake", email: "sumedha_kumanayake@yahoo.com" },
      { name: "Dr. Udaya Wanigasiri", email: "wanigasiri@yahoo.com" },
      { name: "Dr R K J S Rajapakse", email: "sathrajapakse@yahoo.com" },
      { name: "Dr. Udaya Jayakodi", email: "udaya.jayakody@gmail.com" },
      { name: "Dr Nalini Rajendra" },
      { name: "Dr Pavithra Rubasinghe" },
      { name: "Dr Amali Saratchandra" },
      { name: "Dr M C Wettasinghe" },
      { name: "Dr Geethika Perera" },
    ],
  },
  {
    title: "Council Members 2024/2025",
    year: 2024,
    leaders: [
      { name: "Prof Harsha Dissanayake (President)", email: "harshadis@sjp.ac.lk" },
      { name: "Dr Shehan Waas (President Elect)", email: "harshadis@sjp.ac.lk" },
      { name: "Dr. Asanka Perera (Hon. Secretary)", email: "pasanka25@yahoo.com" },
      { name: "Dr. Nayana Samarasinghe (Asst. Secretary – Academic )", email: "nsamar@hotmail.com" },
      { name: "Dr.Uditha Kodithuwakku (Asst. Secretary – Social )", email: "udithakod@yahoo.com" },
      { name: "Dr. W. Meegoda (Hon. Treasurer)", email: "wmeegoda@gmail.com" },
      { name: "Dr Wasantha Sathkorala (Asst. Treasurer)", email: "wasanthawk@yahoo.com" },
      { name: "Dr Shantha Hettiarachchi (Past President)", email: "shanthahetti65@gmail.com" },
    ],
    members: [
      { name: "Dr Sarath Perera" },
      { name: "Dr Sumedha Kumanayake", email: "sumedha_kumanayake@yahoo.com" },
      { name: "Dr. Udaya Wanigasiri", email: "wanigasiri@yahoo.com" },
      { name: "Dr Nalaka Wijenarayana" },
      { name: "Dr. R K J S Rajapakse", email: "sathrajapakse@yahoo.com" },
      { name: "Dr K M R Kannangara", email: "rupakannangara@ymail.com" },
      { name: "Dr. Udaya Jayakodi", email: "udaya.jayakody@gmail.com" },
      { name: "Dr Eranga Ganewatte", email: "erangaganewatte@ymail.com" },
      { name: "Dr. Chinthaka Appuhamy", email: "chinthaka05a@yahoo.com" },
      { name: "Dr Mahesh Mendis", email: "udithakod@yahoo.com" },
    ],
  },
  {
    title: "Council Members 2023/2024",
    year: 2023,
    leaders: [
      { name: "Dr Shantha Hettiarachchi (President)", email: "shanthahetti65@gmail.com" },
      { name: "Dr P Harsha Dissanayake (President Elect)", email: "harshadis@sjp.ac.lk" },
      { name: "Dr Samitha Hiranya Egodage (Hon. Secretary)", email: "egodagesh@gmail.com" },
      { name: "Dr Eranga Ganewatte (Asst. Secretary – Academic )", email: "erangaganewatte@ymail.com" },
      { name: "Dr. Asanka Perera (Asst. Secretary – Social )", email: "pasanka25@yahoo.com" },
      { name: "Dr. W. Meegoda (Hon. Treasurer)", email: "wmeegoda@gmail.com" },
      { name: "Dr Wasantha Sathkorala (Asst. Treasurer)", email: "wasanthawk@yahoo.com" },
      { name: "Dr. W. A. Dileep Karunaratne (Past President)", email: "drdileep2003@gmail.com" },
    ],
    members: [
      { name: "Dr. Nayana Samarasinghe", email: "nsamar@hotmail.com" },
      { name: "Dr. K M G Sandeepani Jayasooriya", email: "sandeepani.jayasuriya@gmail.com" },
      { name: "Dr K M R Kannangara", email: "rupakannangara@ymail.com" },
      { name: "Dr Sumedha Kumanayake", email: "sumedha_kumanayake@yahoo.com" },
      { name: "Dr. Chinthaka Appuhamy", email: "chinthaka05a@yahoo.com" },
      { name: "Dr. Madurika Kaviratne", email: "madukavi123@yahoo.com" },
      { name: "Dr. Udaya Jayakodi", email: "udaya.jayakody@gmail.com" },
      { name: "Dr. R K J S Rajapakse", email: "sathrajapakse@yahoo.com" },
      { name: "Dr. Udaya Wanigasiri", email: "wanigasiri@yahoo.com" },
      { name: "Dr Uditha Kodithuwakkuararchchi", email: "udithakod@yahoo.com" },
    ],
  },
  {
    title: "Council Members 2022/2023",
    year: 2022,
    leaders: [
      { name: "Dr. W. A. Dileep Karunaratne (President)", email: "drdileep2003@gmail.com" },
      { name: "Dr Shantha Hettiarachchi (President Elect)", email: "shanthahetti65@gmail.com" },
      { name: "Dr. K.M. R. Kannangara (Hon. Secretary)", email: "rupakannangara@ymail.com" },
      { name: "Dr. S.H. Palihawadana (Asst. Secretary – Academic )", email: "sumudu.hp18@gmail.com" },
      { name: "Dr. R.K.J.S. Rajapakse (Asst. Secretary – Social)", email: "sathrajapakse@yahoo.com" },
      { name: "Dr. W.K. Sathkorala (Hon. Treasurer)", email: "wasanthawk@yahoo.com" },
      { name: "Dr. C. Lokubalasooriya (Asst. Treasurer)", email: "chandrasiri69@yahoo.com" },
    ],
    members: [
      { name: "Dr. W. Meegoda", email: "wmeegoda@gmail.com" },
      { name: "Dr. Uditha Kodithuwakkku", email: "udithakod@yahoo.com" },
      { name: "Dr. P. Udayakumaran", email: "udaikuma@gmail.com" },
      { name: "Dr Janaka Kalubowila", email: "janaka.kalubo@gmail.com" },
      { name: "Dr. Eranga Ganewatte", email: "erangaganewatte@ymail.com" },
      { name: "Dr. Nayana Samarasinghe", email: "nsamar@hotmail.com" },
      { name: "Dr. Udaya Jayakody", email: "udaya.jayakody@gmail.com" },
      { name: "Dr.Thushara Muthunayake", email: "thushara1976@gmail.com" },
      { name: "Dr.Buddhi Galabada", email: "buddhianjaniliyanage@gmail.com" },
      { name: "Dr. Asanka Perera", email: "pasanka25@yahoo.com" },
      { name: "Dr. W. A. Dileep Karunaratne (Immediate past president)", email: "drdileep2003@gmail.com" },
    ],
  },
  {
    title: "Council Members 2020/2021",
    year: 2020,
    leaders: [
      { name: "Dr. M. U. J. Fernando (President)", email: "jerrardf@gmail.com" },
      { name: "Dr. W. A. Dileepa Karunarathna (President Elect)" },
      { name: "Dr. Uditha Kodithuwakku (Hon. Secretary)" },
      { name: "Dr. Nayana Samarasingha (Asst. Secretary – Academic )" },
      { name: "Dr. Shehan Vaas (Asst. Secretary – Social )" },
      { name: "Dr. W. Meegoda (Hon. Treasurer)", email: "wmeegoda@gmail.com" },
      { name: "Dr. S. S. Kumanayake (Asst. Treasurer)", email: "sumedha_kumanayake@yahoo.com" },
    ],
    members: [
      { name: "Dr. Apsara Epa" },
      { name: "Dr. S. Nimalan" },
      { name: "Dr. P. Udayakumaran", email: "udaikuma@gmail.com" },
      { name: "Dr. R. K. J. S. Rajapakse", email: "sathrajapakse@yahoo.com" },
      { name: "Dr. Anton Jenil" },
      { name: "Dr. Janaka Kalubowila", email: "Janaka.kalubo@gmail.com" },
      { name: "Dr. E. Ganewatte", email: "Jerangaganewatte@ymail.com" },
      { name: "Dr. Pandula Hettiarachchi (Immediate past president)", email: "pandula69@icloud.com" },
      { name: "Dr. L. D. C. Chandrasiri Lokubalasuriya" },
      { name: "Dr. K. Sivasithambaram" },
      { name: "Dr. Anuruddika Ranatunge" },
    ],
  },
  {
    title: "Council Members 2019/2020",
    year: 2019,
    leaders: [
      { name: "Dr. Pandula Hettiarachchi (President)", email: "pandula69@icloud.com" },
      { name: "Dr. M. U. J Fernando (Vice President)", email: "jerrardf@gmail.com" },
      { name: "Dr. K.M. R. Kannangara (Hon. Secretary)", email: "rupakannangara@ymail.com" },
      { name: "Dr. S.H. Palihawadana (Asst. Secretary – Academic )", email: "sumudu.hp18@gmail.com" },
      { name: "Dr. R.K.J.S. Rajapakse (Asst. Secretary – Social)", email: "sathrajapakse@yahoo.com" },
      { name: "Dr. W.K. Sathkorala (Hon. Treasurer)", email: "wasanthawk@yahoo.com" },
      { name: "Dr. C. Lokubalasooriya (Asst. Treasurer)", email: "chandrasiri69@yahoo.com" },
    ],
    members: [
      { name: "Dr. W.A. Dileep Karunaratne", email: "drdileep2003@gmail.com" },
      { name: "Dr. W. Meegoda", email: "wmeegoda@gmail.com" },
      { name: "Dr. S. Nimalan", email: "dasnimal@yahoo.com" },
      { name: "Dr. S. S Kumanayake", email: "sumedha_kumanayake@yahoo.com" },
      { name: "Dr. P.R Rabel", email: "pravinathrabel@yahoo.com" },
      { name: "Dr. B.M.P.Bandaranayake", email: "bmpbandaranayake@yahoo.com" },
      { name: "Dr. Udaya Jayakody", email: "udaya.jayakody@gmail.com" },
      { name: "Dr. E. Ganewatte", email: "erangaganewatte@ymail.com" },
      { name: "Dr. K.M.G.S Jayasooriya", email: "Sandeepani.jayasuriya@gmail.com" },
      { name: "Dr. P. Udayakumaran", email: "udaikuma@gmail.com" },
      { name: "Dr. Prasad De Silva (Immediate past president)", email: "prasaddes@hotmail.com" },
    ],
  },
  {
    title: "Council Members 2018/2019",
    year: 2018,
    leaders: [
      { name: "Dr. S.M. Prasad De Silva (President)", email: "prasaddes@hotmail.com" },
      { name: "Dr. P. Hettiarachchi (Vice President)", email: "pandula69@icloud.com" },
      { name: "Dr. Udaya Jayakody (Hon. Secretary)", email: "udaya.jayakody@gmail.com" },
      { name: "Dr. R.K.J.S. Rajapakse (Asst. Secretary – Social )", email: "sathrajapakse@yahoo.com" },
      { name: "Dr. S.H. Palihawadana (Asst. Secretary – Academic )", email: "sumudu.hp18@gmail.com" },
      { name: "Dr. W.K. Sathkorala (Hon. Treasurer)", email: "wasanthawk@yahoo.com" },
      { name: "Dr. C. Lokubalasooriya (Asst. Treasurer)", email: "chandrasiri69@yahoo.com" },
    ],
    members: [
      { name: "Dr. B.M.P. Bandaranayake", email: "bmpbandaranayake@yahoo.com" },
      { name: "Dr. S. Dilakkumar", email: "dilakkumar@gmail.com" },
      { name: "Dr. E. Ganewatte", email: "erangaganewatte@ymail.com" },
      { name: "Dr. K.M.R. Kannangara", email: "rupakannangara@ymail.com" },
      { name: "Dr. U.P. Kumarasena", email: "druditha@yahoo.com" },
      { name: "Dr. W.A. Dileep Karunaratne", email: "drdileep2003@gmail.com" },
      { name: "Dr. Janaka Kalubowila", email: "Janaka.kalubo@gmail.com" },
      { name: "Dr. S. Nimalan", email: "dasnimal@yahoo.com" },
      { name: "Dr. S.A.S.R. Siriwardana", email: "shrmsiriwardana@gmail.com" },
      { name: "Dr. P. Udayakumaran", email: "udaikuma@gmail.com" },
      { name: "Dr. A.S. Pallewatte (Immediate past president)", email: "asp31263@hotmail.com" },
    ],
  },
  {
    title: "Council Members 2017/2018",
    year: 2017,
    leaders: [
      { name: "Dr. A.S. Pallewatte (President)", phone: "071-8384832", email: "asp31263@hotmail.com" },
      { name: "Dr. S.M. Prasad De Silva (Vice President)", phone: "077-7305414", email: "prasaddes@hotmail.com" },
      { name: "Dr. S.H. Palihawadana (Hon. Secretary)", phone: "071-1558862", email: "sumudu.hp18@gmail.com" },
      { name: "Dr. K.M. R. Kannangara (Asst. Secretary – Academic )", phone: "071-8013656", email: "rupakannangara@ymail.com" },
      { name: "Dr. R.K.J.S. Rajapakse (Asst. Secretary – Social)", phone: "077-3909823", email: "sathrajapakse@yahoo.com" },
      { name: "Dr. Harsha Dissanayake (Hon. Treasurer)", phone: "071-8786833", email: "harshadis@yahoo.com" },
      { name: "Dr. W.K. Sathkorala (Asst. Treasurer)", phone: "071-440456", email: "wasanthawk@yahoo.com" },
    ],
    members: [
      { name: "Dr. Udaya Jayakodi", phone: "071-8071248", email: "udaya.jayakody@gmail.com" },
      { name: "Dr. L.D.R.A. Perera", phone: "071-8334283", email: "pasanka25@yahoo.com" },
      { name: "Dr. S.A.S.R. Siriwardana", phone: "0718468868", email: "shrmsiriwardana@gmail.com" },
      { name: "Dr. S. Nimalan", phone: "077-2516160", email: "dasnimal@yahoo.com" },
      { name: "Dr. G.P.P. Kandamby", phone: "077-7790628", email: "gppkandamby@gmail.com" },
      { name: "Dr. P. Hettiarachchi", phone: "071-8425823", email: "pandula69@icloud.com" },
      { name: "Dr. U.P. Kumarasena", phone: "070-2614405", email: "druditha@yahoo.com" },
      { name: "Dr. B.M.P.Bandaranayake", phone: "071-8000156", email: "bmpbandaranayake@yahoo.com" },
      { name: "Dr. E. Ganewatte", phone: "071-4927656", email: "erangaganewatte@ymail.com" },
      { name: "Dr. C. L De Silva", phone: "071-2711326", email: "kulsith@hotmail.com" },
      { name: "Dr. Shanthini Rosairo (Immediate past president)", phone: "071-8233852", email: "shanthinirosairo@yahoo.com" },
    ],
  },
  {
    title: "Council Members 2016/2017",
    year: 2016,
    leaders: [
      { name: "Dr. Shanthini Rosairo (President)", phone: "071-8233852", email: "shanthinirosairo@yahoo.com" },
      { name: "Dr. Aruna Pallewatte (Vice President)", phone: "071-8384832", email: "asp31263@hotmail.com" },
      { name: "Dr. U. P. Ratnayake (Hon. Secretary)", phone: "077-2647002", email: "udithamala@gmail.com" },
      { name: "Dr. Harsha Dissanayake (Hon. Treasurer )", phone: "071-8786833", email: "harshadis@yahoo.com" },
      { name: "Dr. J.J.K.H. Udupihille (Asst. Secretary -Academic)", phone: "077-7737783", email: "jeevani_u@yahoo.co.uk" },
      { name: "Dr. K.M. R. Kannangara (Asst. Secretary –Social)", phone: "071-8013656", email: "rupakannangara@ymail.com" },
      { name: "Dr. I.D.U.K. Wanigasiri (Asst. Treasurer)", phone: "071-8312804", email: "wanigasiri@yahoo.com" },
    ],
    members: [
      { name: "Dr. Janaka Rajapakse", phone: "077-3909823", email: "sathrajapakse@yahoo.com" },
      { name: "Dr. Prasad De Silva", phone: "077-7305414", email: "prasaddes@hotmail.com" },
      { name: "Dr. R.A.N.K.K. Samarasingha", phone: "071-4317163", email: "nsamar@hotmail.com" },
      { name: "Dr. P. S.H. Hettiarachchi", phone: "077-3444019", email: "shantha@asiri.lk" },
      { name: "Dr. Udaya Jayakodi", phone: "071-8071248", email: "udaya.jayakody@gmail.com" },
      { name: "Dr. S. Dilakkumar", phone: "077 2532891", email: "dilakkumar@gmail.com" },
      { name: "Dr. U.A. Liyanage", phone: "077-2097874", email: "udari8@gmail.com" },
      { name: "Dr. L.D.R.A. Perera", phone: "071-8334283", email: "pasanka25@yahoo.com" },
      { name: "Dr. B.A. Galabada", phone: "071-8476564", email: "buddhianjaniliyanage@gmail.com" },
      { name: "Dr. U.P. Kodithuwakku Arachchi", phone: "071-4469048", email: "udithakod@yahoo.com" },
      { name: "Dr. D.J. Wickramaratne (Immediate Past President)", phone: "071-8048508", email: "kantha3000@yahoo.com" },
    ],
  },
  {
    title: "Council Members 2015/2016",
    year: 2015,
    leaders: [
      { name: "Dr. D.J. Wickramaratne (President)", phone: "071-8048508", email: "wickramaratnej@yahoo.com" },
      { name: "Dr. S. Rosairo (Vice President)", phone: "071-8233852", email: "shanthinirosairo@yahoo.com" },
      { name: "Dr. B. N. Abeywickrama (Hon. Secretary)", phone: "071-4857041", email: "buddhiabeywickrama@yahoo.com" },
      { name: "Dr. Harsha Dissanayake (Hon. Treasurer )", phone: "071-8786833", email: "harshadis@yahoo.com" },
      { name: "Dr. S.H. Egodage (Asst. Secretary -Academic)", phone: "077-7749383", email: "egodagesh@hotmail.com" },
      { name: "Dr. Chandana Peiris (Asst. Secretary –Social)", phone: "071-5309138", email: "tpcpeiris@gmail.com" },
      { name: "Dr. S. Samaraweera (Asst. Treasurer)", phone: "077-7228080", email: "subhashini.samaraweera@yahoo.com" },
    ],
    members: [
      { name: "Dr. Janaka Rajapakse", phone: "077-3909823", email: "sathrajapakse@yahoo.com" },
      { name: "Dr. Prasad De Silva", phone: "077-7305414", email: "prasaddes@hotmail.com" },
      { name: "Dr. W. K. Sathkorala", phone: "071-4440456", email: "wasanthawk@yahoo.com" },
      { name: "Dr. R.A.N.K.K. Samarasingha", phone: "071-4317163", email: "nsamar@hotmail.com" },
      { name: "Dr. D.T.K. Gamage", phone: "071-8390026", email: "dhanusha.gamage@gmail.com" },
      { name: "Dr. S.K.Y.I. Kodikara", phone: "071-8390027", email: "iroshani.kodikara@gmail.com" },
      { name: "Dr. P. S.H. Hettiarachchi", phone: "077-3444019", email: "shantha@asiri.lk" },
      { name: "Dr. S. S. Kumanayaka", phone: "071-8184365", email: "sumedha_kumanayake@yahoo.com" },
      { name: "Dr. Udaya Jayakodi", phone: "071-8071248", email: "udaya.jayakody@gmail.com" },
      { name: "Dr. Y.A. P. De Silva", phone: "0773-051981", email: "desilva.y@gmail.com" },
      { name: "Dr. Chandra Sirigampala (Immediate Past President)", phone: "077-3772410", email: "chandrasirigampala@gmail.com" },
    ],
  },
  {
    title: "Council Members 2014/2015",
    year: 2014,
    leaders: [
      { name: "Dr. Chandra Sirigampala (President)", phone: "077-3772410", email: "chandrasirigampala@gmail.com" },
      { name: "Dr. J. Wickramarathna (Vice President)", phone: "071-8048508", email: "wickramaratnej@yahoo.com" },
      { name: "Dr. Janaka Rajapakse (Hon. Secretary)", phone: "0773909823", email: "sathrajapakse@yahoo.com" },
      { name: "Dr. U.G.L.N. Gamage (Hon. Treasurer )", phone: "071-4336375", email: "lalith_gamage@yahoo.com" },
      { name: "Dr. Rupa Kannangara (Asst. Secretary -Academic)", phone: "071-8013656", email: "rupakannangara@ymail.com" },
      { name: "Dr. Chandana Peiris (Asst. Secretary –Social)", phone: "071-5309138", email: "tpcpeiris@gmail.com" },
      { name: "Dr. Apsara Epa (Asst. Treasurer)", phone: "0777037085", email: "apsara_epa@yahoo.com" },
      { name: "Dr. AS Pallewatta ( Editors)", phone: "0718384832", email: "Asp31263@hotmail.com" },
      { name: "Dr. Sumudu Palihawadana", phone: "071-1558862", email: "Sumudu.hp18@gmail.com" },
    ],
    members: [
      { name: "Dr. Udari Liyanage", phone: "077-2097874", email: "udari8@gmail.com" },
      { name: "Dr. Prasad De Silva", phone: "077-7305414", email: "prasaddes@hotmail.com" },
      { name: "Dr. W.A.D. Karunarathne", phone: "0777724443", email: "Drdileep2003@gmail.com" },
      { name: "Dr. Jerrard Fernando", phone: "0772532891", email: "jerrardf@gmail.com" },
      { name: "Dr. Harsha Dissanayake", phone: "0718786833", email: "harshadis@yahoo.com" },
      { name: "Dr. K. Samarawickrama (Immediate Past President)", phone: "071-2778228", email: "Kantha3000@yahoo.com" },
    ],
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Add it to .env.local first.");
  }
  const dbName = process.env.MONGODB_DB ?? "slcr";

  const client = new MongoClient(uri);
  await client.connect();

  try {
    const db = client.db(dbName);
    console.log(`Connected to database: ${dbName}`);

    // President messages: current + past in one collection, ordered by createdAt
    const messages = db.collection<PresidentMessage>("presidentMessages");
    await messages.deleteMany({});
    await messages.insertMany([CURRENT_PRESIDENT, ...PAST_MESSAGES]);
    await messages.createIndex({ slug: 1 }, { unique: true });
    await messages.createIndex({ createdAt: -1 });
    console.log(
      `Seeded presidentMessages: ${1 + PAST_MESSAGES.length} documents`
    );

    // Past presidents: chronological roll call
    const pastPresidents = db.collection<PastPresident>("pastPresidents");
    await pastPresidents.deleteMany({});
    await pastPresidents.insertMany(
      PAST_PRESIDENTS.map((p, i) => ({ ...p, order: i + 1 }))
    );
    await pastPresidents.createIndex({ order: 1 }, { unique: true });
    console.log(
      `Seeded pastPresidents: ${PAST_PRESIDENTS.length} documents`
    );

    // Past councils: one document per council year
    const councils = db.collection<PastCouncil>("pastCouncils");
    await councils.deleteMany({});
    await councils.insertMany(PAST_COUNCILS);
    await councils.createIndex({ year: -1 }, { unique: true });
    console.log(`Seeded pastCouncils: ${PAST_COUNCILS.length} documents`);

    console.log("Seed complete.");
  } finally {
    await client.close();
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
