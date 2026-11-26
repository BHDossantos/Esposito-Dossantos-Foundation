// Ported from Jennifer (src/company/businessAgents.ts). Generated; edit in Jennifer and re-port.
import type { BusinessAgent } from './core';

export const BUSINESS_AGENTS: BusinessAgent[] = [
  {
    "companyId": "foundation",
    "name": "Foundation agent",
    "mission": "Find scholarship sponsors and program partners for youth education, music and digital literacy, and prepare the Rome benefit.",
    "routine": {
      "name": "Esposito–Dossantos Foundation",
      "does": "Daily campaign pack and up to five new qualified sponsors or partners in Italy, Spain, Portugal or the U.S."
    },
    "guardrails": [
      "Use only verified activities and impact.",
      "Mention the benefit date only when the approved brain confirms it.",
      "Scholarship sponsor asks and program partner asks stay distinct."
    ],
    "measures": [
      "sponsor conversations",
      "qualified sponsorship interest",
      "partner commitments",
      "benefit RSVPs"
    ],
    "tasks": [
      {
        "id": "sponsors",
        "name": "Qualify sponsors and partners",
        "department": "sales",
        "cadence": "daily",
        "does": "Qualify scholarship sponsors and program partners. The daily Claude routine finds and drafts; this task qualifies what it logged, drops duplicates and anyone on the do-not-contact list, and proposes the next step for each.",
        "inputs": [
          "offer",
          "icp",
          "CRM accounts"
        ],
        "outputs": [
          "sponsor and partner ask drafts",
          "CRM tasks"
        ],
        "approval": "Asks wait for Bruno."
      },
      {
        "id": "benefit",
        "name": "Rome benefit preparation",
        "department": "operations",
        "cadence": "weekly",
        "does": "List what the Rome benefit still needs: venue items, program, guests, sponsors and deadlines, with owners.",
        "inputs": [
          "procedures",
          "suppliers",
          "CRM tasks"
        ],
        "outputs": [
          "checklist",
          "CRM tasks"
        ],
        "approval": "Bookings, invitations and payments wait for Bruno."
      },
      {
        "id": "donors",
        "name": "Donor and sponsor follow-up",
        "department": "customer",
        "cadence": "weekly",
        "does": "Propose thank-yous and updates for sponsors and donors who engaged this week.",
        "inputs": [
          "brand",
          "procedures"
        ],
        "outputs": [
          "thank-you drafts"
        ],
        "approval": "Messages wait for Bruno."
      }
    ]
  },
  {
    "companyId": "nonprofit",
    "name": "United Youth Orchestra agent",
    "mission": "Keep the orchestra and teen program with the Vatican sisters organized, and support it through the Foundation.",
    "guardrails": [
      "Never share details about minors; logistics only.",
      "Program and partner details only from the approved brain."
    ],
    "measures": [
      "rehearsals held",
      "partner commitments"
    ],
    "tasks": [
      {
        "id": "program",
        "name": "Program logistics",
        "department": "operations",
        "cadence": "weekly",
        "does": "List open program items: rehearsals, instruments, volunteers and deadlines, with owners.",
        "inputs": [
          "procedures",
          "suppliers"
        ],
        "outputs": [
          "checklist",
          "CRM tasks"
        ],
        "approval": "Anything that books, invites or pays waits for Bruno."
      },
      {
        "id": "partners",
        "name": "Partner follow-up",
        "department": "customer",
        "cadence": "weekly",
        "does": "Propose updates and follow-ups for the program’s partners.",
        "inputs": [
          "brand",
          "procedures"
        ],
        "outputs": [
          "update drafts"
        ],
        "approval": "Messages wait for Bruno."
      }
    ]
  }
];

export const BUSINESS_AGENT: BusinessAgent = BUSINESS_AGENTS[0];
