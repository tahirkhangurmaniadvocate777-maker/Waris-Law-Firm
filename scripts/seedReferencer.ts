import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('?? Starting transaction-free seeding of Pakistani Legal Referencer data...');

  const legalSections = [
    {
      _id: "sec-497-crpc",
      title: 'Bail in Bailable and Non-Bailable Offences (CrPC 497)',
      category: 'CrPC/PPC section',
      sectionNumber: '497',
      keywords: 'bail, CrPC 497, criminal law, non-bailable, regular bail',
      shortNote: 'Statutory rules for regular bail petitions before Magistrates or Sessions Judges.',
      checklistJson: '["Check if FIR is registered","Verify non-bailable offense parameters","Draft bail petition under Sec 497 CrPC","Attach copy of FIR and certified grounds of bail"]',
      createdAt: { $date: new Date().toISOString() },
      updatedAt: { $date: new Date().toISOString() }
    },
    {
      _id: "sec-249a-crpc",
      title: 'Power of Court to Release Accused via Acquittal at any Stage (CrPC 249-A)',
      category: 'CrPC/PPC section',
      sectionNumber: '249-A',
      keywords: 'acquittal, 249-A, magistrate, criminal trial, groundless',
      shortNote: 'Magistrate power to acquit an accused person at any stage if the charge is groundless.',
      checklistJson: '["Review charge sheet / Challan","Confirm groundless nature of accusation","Draft application under Sec 249-A CrPC","Argue no probability of conviction before the Magistrate"]',
      createdAt: { $date: new Date().toISOString() },
      updatedAt: { $date: new Date().toISOString() }
    },
    {
      _id: "sec-265k-crpc",
      title: 'Acquittal of Accused by Sessions Court at any Stage (CrPC 265-K)',
      category: 'CrPC/PPC section',
      sectionNumber: '265-K',
      keywords: 'acquittal, 265-K, sessions court, criminal trial, high court',
      shortNote: 'Sessions Court power of acquittal at any structural phase of a trial.',
      checklistJson: '["Examine prosecution evidence on record","Verify absence of incriminating material","Draft application under Sec 265-K CrPC","Argue before the Sessions Judge"]',
      createdAt: { $date: new Date().toISOString() },
      updatedAt: { $date: new Date().toISOString() }
    },
    {
      _id: "art-129g-qso",
      title: 'Production of Best Evidence and Adverse Inference (QSO Art 129)',
      category: 'case law',
      sectionNumber: 'Art 129(g)',
      keywords: 'evidence, QSO, adverse inference, article 129, prosecution omission',
      shortNote: 'Adverse inference rule if the prosecution intentionally withholds the best evidence.',
      checklistJson: '["Identify material evidence withheld by prosecution","Document presence of the asset in official custody","Invoke Article 129(g) of QSO during trial closing arguments"]',
      createdAt: { $date: new Date().toISOString() },
      updatedAt: { $date: new Date().toISOString() }
    },
    {
      _id: "sec-7-fca",
      title: 'Suit for Dissolution of Marriage via Khula',
      category: 'timeline',
      sectionNumber: 'Section 7',
      keywords: 'family law, khula, marriage, dissolution, dowry articles, maintenance',
      shortNote: 'Pleading criteria and timeline parameters for suits involving a Khula decree.',
      checklistJson: '["Draft Family Suit petition","Include specific grounds for structural Khula","List dowry articles and maintenance claims","File in competent Family Court jurisdiction"]',
      createdAt: { $date: new Date().toISOString() },
      updatedAt: { $date: new Date().toISOString() }
    }
  ];

  // Execute a direct raw MongoDB command to completely bypass transactional limitations
  await prisma.$runCommandRaw({
    insert: 'ReferencerEntry',
    documents: legalSections
  });

  console.log('? Successfully seeded ' + legalSections.length + ' legal reference milestones directly into MongoDB!');
}

main()
  .catch((e) => {
    console.error('? Seeding process encountered an error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
