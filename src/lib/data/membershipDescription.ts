export type MembershipListItem = {
  label: string;
  text: string;
};

export type MembershipSubsection = {
  title: string;
  intro?: string;
  items?: MembershipListItem[];
  paragraphs?: string[];
  nestedItems?: MembershipListItem[];
};

export type MembershipSection = {
  heading: string;
  subsections: MembershipSubsection[];
};

export const MEMBERSHIP_DESCRIPTION_SECTIONS: MembershipSection[] = [
  {
    heading: "MEMBERSHIP",
    subsections: [
      {
        title: "A. Ordinary Membership",
        items: [
          {
            label: "I.",
            text: "Ordinary Membership is open to any Medical Practitioner who holds a Postgraduate qualification in Clinical Radiology, approved by the Post Graduate Institute of Medicine, University of Colombo and recognized by the Council of the Association.",
          },
          {
            label: "II.",
            text: "An Ordinary Member who pays his/her membership fees for life shall be called an Ordinary Life Member.",
          },
          {
            label: "III.",
            text: "The Association may accept applications from overseas Members who are not resident in Sri Lanka and select any person eligible to be an ordinary Member of the Association as an Overseas Life Member. Once elected, Overseas Member shall pay a subscription equal to or greater than that paid by an Ordinary Member, as decided by the Council.",
          },
        ],
      },
      {
        title: "B. Associate Membership",
        intro: "Associate Membership is open to following categories:",
        items: [
          {
            label: "I.",
            text: "Any Medical Practitioner following a course of study, leading to a Post Graduate qualification in clinical Radiology, recognized by the Post Graduate Institute of Medicine, of University Colombo.",
          },
          {
            label: "II.",
            text: "Medical Physicists and Radio Biologists who are associated with clinical Radiology, clinical Oncology and Allied Sciences.",
          },
        ],
      },
      {
        title: "C. Honorary Membership",
        paragraphs: [
          "Council may from time to time admit distinguished persons as Honorary Members. The Council shall determine the criteria of selection of Honorary Members and appoint a subcommittee to recommend such membership.",
        ],
      },
      {
        title: "D.",
        paragraphs: [
          "Notwithstanding the above, status core of the professionals in the fields other than Clinical Radiology who secured Life/Ordinary Membership prior to promulgation of this Article shall be maintained as it is.",
        ],
      },
      {
        title: "E. Membership and Rights of Members",
        items: [
          {
            label: "I.",
            text: "Ordinary life Members, Ordinary Members are entitled to all rights and privileges and are eligible to vote and hold office of the Association. Honorary Members are entitled to all rights and privileges of an Ordinary/Ordinary life Members, except voting rights and the right to hold office of the Association.",
          },
          {
            label: "II.",
            text: "Following categories are not entitled to hold office in the Association or voting rights.",
          },
        ],
        nestedItems: [
          { label: "i.", text: "Honorary Members" },
          { label: "ii.", text: "Overseas Life Members" },
          { label: "iii.", text: "Associate Members" },
        ],
      },
      {
        title: "F. Membership Fees",
        items: [
          {
            label: "I.",
            text: "Membership fees for each category of Members shall be decided on the recommendations of the Council, from time to time with the approval of the simple majority of the Membership at a General Meeting of the Association.",
          },
          {
            label: "II.",
            text: "The Annual Membership fee for Associate Membership should be paid on or before the 31st of January each year.",
          },
        ],
      },
      {
        title: "G. Award of Fellowships",
        paragraphs: [
          "The Council may from time to time honor members by bestowing them the title of the Fellow of the Association in recognition of exceptional services rendered to clinical radiology. The Council shall for this purpose determine the criteria of selections of such Fellows and appoint a subcommittee to recommend such awards.",
        ],
      },
    ],
  },
  {
    heading: "TERMINATION OF MEMBERSHIP",
    subsections: [
      {
        title: "A.",
        intro:
          "Membership of the Association shall be terminated ipso-facto in any of the following eventualities:",
        items: [
          {
            label: "I.",
            text: "On a sentence of imprisonment for any criminal offence by a Court of Law in Sri Lanka or Abroad.",
          },
          {
            label: "II.",
            text: "On erasure from the Register of Medical Practitioner's under section 34 of the Medical Ordinance.",
          },
        ],
      },
      {
        title: "B.",
        intro:
          "Membership of the Association may also be terminated in any of the following ways. This is applicable to all categories qualified under section 3.",
        items: [
          {
            label: "I.",
            text: "By resignation subject to one month previous notice in writing given to the Association.",
          },
          {
            label: "II.",
            text: "By expulsion after an inquiry in the manner prescribed in Para 4 C, on the ground that retention of the Member is detrimental to the honour and prestige of the Medical field or of the Association unto disrepute or contempt or on the grounds that the Member has willfully and persistently refused to comply with or has committed a willful breach of the provisions of this Article.",
          },
        ],
      },
      {
        title: "C.",
        intro:
          "Following procedural steps to be followed for termination of Membership, following disciplinary inquiry against a Member.",
        items: [
          {
            label: "I.",
            text: "On representations being made in writing by any two Members that by reasons of his or her conduct, a Member has disqualified himself or herself from Membership, that Council may hold an ex-parte inquiry into such allegation and, if satisfied with the allegations made, shall fix a date of inquiry into such allegation. The Member whose conduct is being inquired into shall be entitled to 28 days prior notice in writing (which notice shall contain a statement of the allegation made) to be present personally or with a Lawyer or a Member representing his interest to lead evidence in support of his or her defense.",
          },
          {
            label: "II.",
            text: "If the Council is of the opinion that by reason of such conduct, a Member has disqualified himself, it shall submit a report of the inquiry as well as the Council's finding at the General Meeting of the Association. For the purpose of such a report the Council shall be entitled to appoint a Committee to inquire into the allegations and make further inquiries into the allegations and the conduct of such Member if it is deemed necessary.",
          },
          {
            label: "III.",
            text: "At such General Meeting the report of the Council shall be considered and a resolution moved for the expulsion of such a Member or whatever the action the Council recommends.",
          },
          {
            label: "IV.",
            text: "Two thirds majority of those present shall be required to carry out the recommendation of the Council.",
          },
        ],
      },
      {
        title: "D.",
        paragraphs: [
          "Any Member expelled shall notwithstanding that he or she has ceased to be a Member, be liable to pay all the sums due from him or her to the Association at the time of his or her expulsion.",
        ],
      },
      {
        title: "E.",
        paragraphs: [
          "A Member in regard to whom representations as aforesaid has been made or whose conduct is under investigation or the subject of inquiry by the Association or by any Committee authorized on their behalf by the Council shall not be entitled to resign his or her Membership of the Association, nor shall his or her membership be terminated in pursuance of Articles 9 hereof until the investigations completed and decision there under is made known. An inquiry or investigation shall for the purpose of this article be deemed to commence at the time when the matter of such investigation or inquiry is officially brought to the notice of the Council.",
        ],
      },
      {
        title: "F.",
        paragraphs: ["Membership will also terminate in the event of death of a Member."],
      },
      {
        title: "G.",
        paragraphs: [
          "All disciplinary committees appointed to inquire into conduct of a member should consist of five persons comprising the incumbent President, 2 past presidents and 2 senior members appointed by the council. The incumbent president shall preside at the meetings of the committee. The decision reached by the Committee should be communicated to the Council in writing.",
        ],
      },
    ],
  },
];
