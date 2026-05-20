import PageHeader from "@/components/the-college/PageHeader";

type CouncilEntry = {
  name: string;
  phone?: string;
  email?: string;
};

type CouncilYear = {
  title: string;
  leaders: CouncilEntry[];
  members: CouncilEntry[];
};

const YEAR_STYLES = [
  "bg-slate-50",
  "bg-amber-50",
  "bg-emerald-50",
  "bg-blue-50",
  "bg-rose-50",
  "bg-indigo-50",
  "bg-teal-50",
  "bg-orange-50",
  "bg-lime-50",
  "bg-cyan-50",
  "bg-violet-50",
  "bg-stone-50",
];

const COUNCIL_YEARS: CouncilYear[] = [
  {
    title: "Council Members 2025/2026",
    leaders: [
      { name: "Dr Sheahan Waas (President)" },
      {
        name: "Dr. Nayana Samarasinghe (President Elect)",
        email: "nsamar@hotmail.com",
      },
      { name: "Dr Sashika Alahakoon (Hon. Secretary)" },
      {
        name: "Dr K M R Kannangara (Asst. Secretary – Academic )",
        email: "rupakannangara@ymail.com",
      },
      { name: "Dr Induni Douglas (Asst. Secretary – Social )" },
      {
        name: "Dr Wasantha Sathkorala (Hon. Treasurer)",
        email: "wasanthawk@yahoo.com",
      },
      {
        name: "Dr. W Meegoda (Asst. Treasurer)",
        email: "wmeegoda@gmail.com",
      },
      {
        name: "Prof Harsha Dissanayake (Past President)",
        email: "harshadis@sjp.ac.lk",
      },
    ],
    members: [
      { name: "Dr Buddhi Abeywickrama" },
      {
        name: "Dr Sumedha Kumanayake",
        email: "sumedha_kumanayake@yahoo.com",
      },
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
    leaders: [
      {
        name: "Prof Harsha Dissanayake (President)",
        email: "harshadis@sjp.ac.lk",
      },
      {
        name: "Dr Shehan Waas (President Elect)",
        email: "harshadis@sjp.ac.lk",
      },
      {
        name: "Dr. Asanka Perera (Hon. Secretary)",
        email: "pasanka25@yahoo.com",
      },
      {
        name: "Dr. Nayana Samarasinghe (Asst. Secretary – Academic )",
        email: "nsamar@hotmail.com",
      },
      {
        name: "Dr.Uditha Kodithuwakku (Asst. Secretary – Social )",
        email: "udithakod@yahoo.com",
      },
      {
        name: "Dr. W. Meegoda (Hon. Treasurer)",
        email: "wmeegoda@gmail.com",
      },
      {
        name: "Dr Wasantha Sathkorala (Asst. Treasurer)",
        email: "wasanthawk@yahoo.com",
      },
      {
        name: "Dr Shantha Hettiarachchi (Past President)",
        email: "shanthahetti65@gmail.com",
      },
    ],
    members: [
      { name: "Dr Sarath Perera" },
      {
        name: "Dr Sumedha Kumanayake",
        email: "sumedha_kumanayake@yahoo.com",
      },
      { name: "Dr. Udaya Wanigasiri", email: "wanigasiri@yahoo.com" },
      { name: "Dr Nalaka Wijenarayana" },
      { name: "Dr. R K J S Rajapakse", email: "sathrajapakse@yahoo.com" },
      {
        name: "Dr K M R Kannangara",
        email: "rupakannangara@ymail.com",
      },
      { name: "Dr. Udaya Jayakodi", email: "udaya.jayakody@gmail.com" },
      {
        name: "Dr Eranga Ganewatte",
        email: "erangaganewatte@ymail.com",
      },
      {
        name: "Dr. Chinthaka Appuhamy",
        email: "chinthaka05a@yahoo.com",
      },
      { name: "Dr Mahesh Mendis", email: "udithakod@yahoo.com" },
    ],
  },
  {
    title: "Council Members 2023/2024",
    leaders: [
      {
        name: "Dr Shantha Hettiarachchi (President)",
        email: "shanthahetti65@gmail.com",
      },
      {
        name: "Dr P Harsha Dissanayake (President Elect)",
        email: "harshadis@sjp.ac.lk",
      },
      {
        name: "Dr Samitha Hiranya Egodage (Hon. Secretary)",
        email: "egodagesh@gmail.com",
      },
      {
        name: "Dr Eranga Ganewatte (Asst. Secretary – Academic )",
        email: "erangaganewatte@ymail.com",
      },
      {
        name: "Dr. Asanka Perera (Asst. Secretary – Social )",
        email: "pasanka25@yahoo.com",
      },
      {
        name: "Dr. W. Meegoda (Hon. Treasurer)",
        email: "wmeegoda@gmail.com",
      },
      {
        name: "Dr Wasantha Sathkorala (Asst. Treasurer)",
        email: "wasanthawk@yahoo.com",
      },
      {
        name: "Dr. W. A. Dileep Karunaratne (Past President)",
        email: "drdileep2003@gmail.com",
      },
    ],
    members: [
      { name: "Dr. Nayana Samarasinghe", email: "nsamar@hotmail.com" },
      {
        name: "Dr. K M G Sandeepani Jayasooriya",
        email: "sandeepani.jayasuriya@gmail.com",
      },
      {
        name: "Dr K M R Kannangara",
        email: "rupakannangara@ymail.com",
      },
      {
        name: "Dr Sumedha Kumanayake",
        email: "sumedha_kumanayake@yahoo.com",
      },
      {
        name: "Dr. Chinthaka Appuhamy",
        email: "chinthaka05a@yahoo.com",
      },
      {
        name: "Dr. Madurika Kaviratne",
        email: "madukavi123@yahoo.com",
      },
      { name: "Dr. Udaya Jayakodi", email: "udaya.jayakody@gmail.com" },
      { name: "Dr. R K J S Rajapakse", email: "sathrajapakse@yahoo.com" },
      { name: "Dr. Udaya Wanigasiri", email: "wanigasiri@yahoo.com" },
      {
        name: "Dr Uditha Kodithuwakkuararchchi",
        email: "udithakod@yahoo.com",
      },
    ],
  },
  {
    title: "Council Members 2022/2023",
    leaders: [
      {
        name: "Dr. W. A. Dileep Karunaratne (President)",
        email: "drdileep2003@gmail.com",
      },
      {
        name: "Dr Shantha Hettiarachchi (President Elect)",
        email: "shanthahetti65@gmail.com",
      },
      {
        name: "Dr. K.M. R. Kannangara (Hon. Secretary)",
        email: "rupakannangara@ymail.com",
      },
      {
        name: "Dr. S.H. Palihawadana (Asst. Secretary – Academic )",
        email: "sumudu.hp18@gmail.com",
      },
      {
        name: "Dr. R.K.J.S. Rajapakse (Asst. Secretary – Social)",
        email: "sathrajapakse@yahoo.com",
      },
      {
        name: "Dr. W.K. Sathkorala (Hon. Treasurer)",
        email: "wasanthawk@yahoo.com",
      },
      {
        name: "Dr. C. Lokubalasooriya (Asst. Treasurer)",
        email: "chandrasiri69@yahoo.com",
      },
    ],
    members: [
      { name: "Dr. W. Meegoda", email: "wmeegoda@gmail.com" },
      { name: "Dr. Uditha Kodithuwakkku", email: "udithakod@yahoo.com" },
      { name: "Dr. P. Udayakumaran", email: "udaikuma@gmail.com" },
      { name: "Dr Janaka Kalubowila", email: "janaka.kalubo@gmail.com" },
      {
        name: "Dr. Eranga Ganewatte",
        email: "erangaganewatte@ymail.com",
      },
      { name: "Dr. Nayana Samarasinghe", email: "nsamar@hotmail.com" },
      { name: "Dr. Udaya Jayakody", email: "udaya.jayakody@gmail.com" },
      {
        name: "Dr.Thushara Muthunayake",
        email: "thushara1976@gmail.com",
      },
      {
        name: "Dr.Buddhi Galabada",
        email: "buddhianjaniliyanage@gmail.com",
      },
      { name: "Dr. Asanka Perera", email: "pasanka25@yahoo.com" },
      {
        name: "Dr. W. A. Dileep Karunaratne (Immediate past president)",
        email: "drdileep2003@gmail.com",
      },
    ],
  },
  {
    title: "Council Members 2020/2021",
    leaders: [
      {
        name: "Dr. M. U. J. Fernando (President)",
        email: "jerrardf@gmail.com",
      },
      { name: "Dr. W. A. Dileepa Karunarathna (President Elect)" },
      { name: "Dr. Uditha Kodithuwakku (Hon. Secretary)" },
      { name: "Dr. Nayana Samarasingha (Asst. Secretary – Academic )" },
      { name: "Dr. Shehan Vaas (Asst. Secretary – Social )" },
      {
        name: "Dr. W. Meegoda (Hon. Treasurer)",
        email: "wmeegoda@gmail.com",
      },
      {
        name: "Dr. S. S. Kumanayake (Asst. Treasurer)",
        email: "sumedha_kumanayake@yahoo.com",
      },
    ],
    members: [
      { name: "Dr. Apsara Epa" },
      { name: "Dr. S. Nimalan" },
      { name: "Dr. P. Udayakumaran", email: "udaikuma@gmail.com" },
      {
        name: "Dr. R. K. J. S. Rajapakse",
        email: "sathrajapakse@yahoo.com",
      },
      { name: "Dr. Anton Jenil" },
      { name: "Dr. Janaka Kalubowila", email: "Janaka.kalubo@gmail.com" },
      {
        name: "Dr. E. Ganewatte",
        email: "Jerangaganewatte@ymail.com",
      },
      {
        name: "Dr. Pandula Hettiarachchi (Immediate past president)",
        email: "pandula69@icloud.com",
      },
      { name: "Dr. L. D. C. Chandrasiri Lokubalasuriya" },
      { name: "Dr. K. Sivasithambaram" },
      { name: "Dr. Anuruddika Ranatunge" },
    ],
  },
  {
    title: "Council Members 2019/2020",
    leaders: [
      {
        name: "Dr. Pandula Hettiarachchi (President)",
        email: "pandula69@icloud.com",
      },
      {
        name: "Dr. M. U. J Fernando (Vice President)",
        email: "jerrardf@gmail.com",
      },
      {
        name: "Dr. K.M. R. Kannangara (Hon. Secretary)",
        email: "rupakannangara@ymail.com",
      },
      {
        name: "Dr. S.H. Palihawadana (Asst. Secretary – Academic )",
        email: "sumudu.hp18@gmail.com",
      },
      {
        name: "Dr. R.K.J.S. Rajapakse (Asst. Secretary – Social)",
        email: "sathrajapakse@yahoo.com",
      },
      {
        name: "Dr. W.K. Sathkorala (Hon. Treasurer)",
        email: "wasanthawk@yahoo.com",
      },
      {
        name: "Dr. C. Lokubalasooriya (Asst. Treasurer)",
        email: "chandrasiri69@yahoo.com",
      },
    ],
    members: [
      { name: "Dr. W.A. Dileep Karunaratne", email: "drdileep2003@gmail.com" },
      { name: "Dr. W. Meegoda", email: "wmeegoda@gmail.com" },
      { name: "Dr. S. Nimalan", email: "dasnimal@yahoo.com" },
      {
        name: "Dr. S. S Kumanayake",
        email: "sumedha_kumanayake@yahoo.com",
      },
      { name: "Dr. P.R Rabel", email: "pravinathrabel@yahoo.com" },
      {
        name: "Dr. B.M.P.Bandaranayake",
        email: "bmpbandaranayake@yahoo.com",
      },
      { name: "Dr. Udaya Jayakody", email: "udaya.jayakody@gmail.com" },
      { name: "Dr. E. Ganewatte", email: "erangaganewatte@ymail.com" },
      {
        name: "Dr. K.M.G.S Jayasooriya",
        email: "Sandeepani.jayasuriya@gmail.com",
      },
      { name: "Dr. P. Udayakumaran", email: "udaikuma@gmail.com" },
      {
        name: "Dr. Prasad De Silva (Immediate past president)",
        email: "prasaddes@hotmail.com",
      },
    ],
  },
  {
    title: "Council Members 2018/2019",
    leaders: [
      {
        name: "Dr. S.M. Prasad De Silva (President)",
        email: "prasaddes@hotmail.com",
      },
      {
        name: "Dr. P. Hettiarachchi (Vice President)",
        email: "pandula69@icloud.com",
      },
      {
        name: "Dr. Udaya Jayakody (Hon. Secretary)",
        email: "udaya.jayakody@gmail.com",
      },
      {
        name: "Dr. R.K.J.S. Rajapakse (Asst. Secretary – Social )",
        email: "sathrajapakse@yahoo.com",
      },
      {
        name: "Dr. S.H. Palihawadana (Asst. Secretary – Academic )",
        email: "sumudu.hp18@gmail.com",
      },
      {
        name: "Dr. W.K. Sathkorala (Hon. Treasurer)",
        email: "wasanthawk@yahoo.com",
      },
      {
        name: "Dr. C. Lokubalasooriya (Asst. Treasurer)",
        email: "chandrasiri69@yahoo.com",
      },
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
      {
        name: "Dr. A.S. Pallewatte (Immediate past president)",
        email: "asp31263@hotmail.com",
      },
    ],
  },
  {
    title: "Council Members 2017/2018",
    leaders: [
      {
        name: "Dr. A.S. Pallewatte (President)",
        phone: "071-8384832",
        email: "asp31263@hotmail.com",
      },
      {
        name: "Dr. S.M. Prasad De Silva (Vice President)",
        phone: "077-7305414",
        email: "prasaddes@hotmail.com",
      },
      {
        name: "Dr. S.H. Palihawadana (Hon. Secretary)",
        phone: "071-1558862",
        email: "sumudu.hp18@gmail.com",
      },
      {
        name: "Dr. K.M. R. Kannangara (Asst. Secretary – Academic )",
        phone: "071-8013656",
        email: "rupakannangara@ymail.com",
      },
      {
        name: "Dr. R.K.J.S. Rajapakse (Asst. Secretary – Social)",
        phone: "077-3909823",
        email: "sathrajapakse@yahoo.com",
      },
      {
        name: "Dr. Harsha Dissanayake (Hon. Treasurer)",
        phone: "071-8786833",
        email: "harshadis@yahoo.com",
      },
      {
        name: "Dr. W.K. Sathkorala (Asst. Treasurer)",
        phone: "071-440456",
        email: "wasanthawk@yahoo.com",
      },
    ],
    members: [
      {
        name: "Dr. Udaya Jayakodi",
        phone: "071-8071248",
        email: "udaya.jayakody@gmail.com",
      },
      {
        name: "Dr. L.D.R.A. Perera",
        phone: "071-8334283",
        email: "pasanka25@yahoo.com",
      },
      {
        name: "Dr. S.A.S.R. Siriwardana",
        phone: "0718468868",
        email: "shrmsiriwardana@gmail.com",
      },
      {
        name: "Dr. S. Nimalan",
        phone: "077-2516160",
        email: "dasnimal@yahoo.com",
      },
      {
        name: "Dr. G.P.P. Kandamby",
        phone: "077-7790628",
        email: "gppkandamby@gmail.com",
      },
      {
        name: "Dr. P. Hettiarachchi",
        phone: "071-8425823",
        email: "pandula69@icloud.com",
      },
      {
        name: "Dr. U.P. Kumarasena",
        phone: "070-2614405",
        email: "druditha@yahoo.com",
      },
      {
        name: "Dr. B.M.P.Bandaranayake",
        phone: "071-8000156",
        email: "bmpbandaranayake@yahoo.com",
      },
      {
        name: "Dr. E. Ganewatte",
        phone: "071-4927656",
        email: "erangaganewatte@ymail.com",
      },
      {
        name: "Dr. C. L De Silva",
        phone: "071-2711326",
        email: "kulsith@hotmail.com",
      },
      {
        name: "Dr. Shanthini Rosairo (Immediate past president)",
        phone: "071-8233852",
        email: "shanthinirosairo@yahoo.com",
      },
    ],
  },
  {
    title: "Council Members 2016/2017",
    leaders: [
      {
        name: "Dr. Shanthini Rosairo (President)",
        phone: "071-8233852",
        email: "shanthinirosairo@yahoo.com",
      },
      {
        name: "Dr. Aruna Pallewatte (Vice President)",
        phone: "071-8384832",
        email: "asp31263@hotmail.com",
      },
      {
        name: "Dr. U. P. Ratnayake (Hon. Secretary)",
        phone: "077-2647002",
        email: "udithamala@gmail.com",
      },
      {
        name: "Dr. Harsha Dissanayake (Hon. Treasurer )",
        phone: "071-8786833",
        email: "harshadis@yahoo.com",
      },
      {
        name: "Dr. J.J.K.H. Udupihille (Asst. Secretary -Academic)",
        phone: "077-7737783",
        email: "jeevani_u@yahoo.co.uk",
      },
      {
        name: "Dr. K.M. R. Kannangara (Asst. Secretary –Social)",
        phone: "071-8013656",
        email: "rupakannangara@ymail.com",
      },
      {
        name: "Dr. I.D.U.K. Wanigasiri (Asst. Treasurer)",
        phone: "071-8312804",
        email: "wanigasiri@yahoo.com",
      },
    ],
    members: [
      {
        name: "Dr. Janaka Rajapakse",
        phone: "077-3909823",
        email: "sathrajapakse@yahoo.com",
      },
      {
        name: "Dr. Prasad De Silva",
        phone: "077-7305414",
        email: "prasaddes@hotmail.com",
      },
      {
        name: "Dr. R.A.N.K.K. Samarasingha",
        phone: "071-4317163",
        email: "nsamar@hotmail.com",
      },
      {
        name: "Dr. P. S.H. Hettiarachchi",
        phone: "077-3444019",
        email: "shantha@asiri.lk",
      },
      {
        name: "Dr. Udaya Jayakodi",
        phone: "071-8071248",
        email: "udaya.jayakody@gmail.com",
      },
      {
        name: "Dr. S. Dilakkumar",
        phone: "077 2532891",
        email: "dilakkumar@gmail.com",
      },
      {
        name: "Dr. U.A. Liyanage",
        phone: "077-2097874",
        email: "udari8@gmail.com",
      },
      {
        name: "Dr. L.D.R.A. Perera",
        phone: "071-8334283",
        email: "pasanka25@yahoo.com",
      },
      {
        name: "Dr. B.A. Galabada",
        phone: "071-8476564",
        email: "buddhianjaniliyanage@gmail.com",
      },
      {
        name: "Dr. U.P. Kodithuwakku Arachchi",
        phone: "071-4469048",
        email: "udithakod@yahoo.com",
      },
      {
        name: "Dr. D.J. Wickramaratne (Immediate Past President)",
        phone: "071-8048508",
        email: "kantha3000@yahoo.com",
      },
    ],
  },
  {
    title: "Council Members 2015/2016",
    leaders: [
      {
        name: "Dr. D.J. Wickramaratne (President)",
        phone: "071-8048508",
        email: "wickramaratnej@yahoo.com",
      },
      {
        name: "Dr. S. Rosairo (Vice President)",
        phone: "071-8233852",
        email: "shanthinirosairo@yahoo.com",
      },
      {
        name: "Dr. B. N. Abeywickrama (Hon. Secretary)",
        phone: "071-4857041",
        email: "buddhiabeywickrama@yahoo.com",
      },
      {
        name: "Dr. Harsha Dissanayake (Hon. Treasurer )",
        phone: "071-8786833",
        email: "harshadis@yahoo.com",
      },
      {
        name: "Dr. S.H. Egodage (Asst. Secretary -Academic)",
        phone: "077-7749383",
        email: "egodagesh@hotmail.com",
      },
      {
        name: "Dr. Chandana Peiris (Asst. Secretary –Social)",
        phone: "071-5309138",
        email: "tpcpeiris@gmail.com",
      },
      {
        name: "Dr. S. Samaraweera (Asst. Treasurer)",
        phone: "077-7228080",
        email: "subhashini.samaraweera@yahoo.com",
      },
    ],
    members: [
      {
        name: "Dr. Janaka Rajapakse",
        phone: "077-3909823",
        email: "sathrajapakse@yahoo.com",
      },
      {
        name: "Dr. Prasad De Silva",
        phone: "077-7305414",
        email: "prasaddes@hotmail.com",
      },
      {
        name: "Dr. W. K. Sathkorala",
        phone: "071-4440456",
        email: "wasanthawk@yahoo.com",
      },
      {
        name: "Dr. R.A.N.K.K. Samarasingha",
        phone: "071-4317163",
        email: "nsamar@hotmail.com",
      },
      {
        name: "Dr. D.T.K. Gamage",
        phone: "071-8390026",
        email: "dhanusha.gamage@gmail.com",
      },
      {
        name: "Dr. S.K.Y.I. Kodikara",
        phone: "071-8390027",
        email: "iroshani.kodikara@gmail.com",
      },
      {
        name: "Dr. P. S.H. Hettiarachchi",
        phone: "077-3444019",
        email: "shantha@asiri.lk",
      },
      {
        name: "Dr. S. S. Kumanayaka",
        phone: "071-8184365",
        email: "sumedha_kumanayake@yahoo.com",
      },
      {
        name: "Dr. Udaya Jayakodi",
        phone: "071-8071248",
        email: "udaya.jayakody@gmail.com",
      },
      {
        name: "Dr. Y.A. P. De Silva",
        phone: "0773-051981",
        email: "desilva.y@gmail.com",
      },
      {
        name: "Dr. Chandra Sirigampala (Immediate Past President)",
        phone: "077-3772410",
        email: "chandrasirigampala@gmail.com",
      },
    ],
  },
  {
    title: "Council Members 2014/2015",
    leaders: [
      {
        name: "Dr. Chandra Sirigampala (President)",
        phone: "077-3772410",
        email: "chandrasirigampala@gmail.com",
      },
      {
        name: "Dr. J. Wickramarathna (Vice President)",
        phone: "071-8048508",
        email: "wickramaratnej@yahoo.com",
      },
      {
        name: "Dr. Janaka Rajapakse (Hon. Secretary)",
        phone: "0773909823",
        email: "sathrajapakse@yahoo.com",
      },
      {
        name: "Dr. U.G.L.N. Gamage (Hon. Treasurer )",
        phone: "071-4336375",
        email: "lalith_gamage@yahoo.com",
      },
      {
        name: "Dr. Rupa Kannangara (Asst. Secretary -Academic)",
        phone: "071-8013656",
        email: "rupakannangara@ymail.com",
      },
      {
        name: "Dr. Chandana Peiris (Asst. Secretary –Social)",
        phone: "071-5309138",
        email: "tpcpeiris@gmail.com",
      },
      {
        name: "Dr. Apsara Epa (Asst. Treasurer)",
        phone: "0777037085",
        email: "apsara_epa@yahoo.com",
      },
      {
        name: "Dr. AS Pallewatta ( Editors)",
        phone: "0718384832",
        email: "Asp31263@hotmail.com",
      },
      {
        name: "Dr. Sumudu Palihawadana",
        phone: "071-1558862",
        email: "Sumudu.hp18@gmail.com",
      },
    ],
    members: [
      {
        name: "Dr. Udari Liyanage",
        phone: "077-2097874",
        email: "udari8@gmail.com",
      },
      {
        name: "Dr. Prasad De Silva",
        phone: "077-7305414",
        email: "prasaddes@hotmail.com",
      },
      {
        name: "Dr. W.A.D. Karunarathne",
        phone: "0777724443",
        email: "Drdileep2003@gmail.com",
      },
      {
        name: "Dr. Jerrard Fernando",
        phone: "0772532891",
        email: "jerrardf@gmail.com",
      },
      {
        name: "Dr. Harsha Dissanayake",
        phone: "0718786833",
        email: "harshadis@yahoo.com",
      },
      {
        name: "Dr. K. Samarawickrama (Immediate Past President)",
        phone: "071-2778228",
        email: "Kantha3000@yahoo.com",
      },
    ],
  },
];

function CouncilTable({ entries }: { entries: CouncilEntry[] }) {
  return (
    <div className="mt-3 space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-navy/60">
        <span>Name</span>
        <span>Telephone</span>
        <span>Email Address</span>
      </div>
      {entries.map((entry, index) => (
        <div
          key={`${entry.name}-${index}`}
          className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-sm text-navy/80"
        >
          <span className="font-medium text-navy">{entry.name}</span>
          <span>{entry.phone || "—"}</span>
          {entry.email ? (
            <a
              href={`mailto:${entry.email}`}
              className="text-navy/70 hover:text-navy transition-colors"
            >
              {entry.email}
            </a>
          ) : (
            <span className="text-navy/70">—</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function PastCouncilsPage() {
  return (
    <>
      <PageHeader title="Past Councils" />
      <section className="py-14 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8 space-y-8">
          {COUNCIL_YEARS.map((year, index) => (
            <div
              key={year.title}
              className={`rounded-2xl p-6 sm:p-8 ${YEAR_STYLES[index % YEAR_STYLES.length]}`}
            >
              <div className="mb-6">
                <h2 className="font-heading text-2xl sm:text-3xl text-navy font-extrabold tracking-tight">
                  {year.title}
                </h2>
                <div className="mt-3 w-12 h-0.5 bg-gold" />
              </div>

              <div className="space-y-6">
                <CouncilTable entries={year.leaders} />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-navy/60">
                    Council Members
                  </p>
                  <CouncilTable entries={year.members} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
