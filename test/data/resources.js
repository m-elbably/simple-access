module.exports = {
  configs: [
    {
      id: 1,
      country: 'Netherlands',
      city: 'Amsterdam-Oost',
    },
    {
      id: 2,
      country: 'Russia',
      city: 'Gorshechnoye',
    }
  ],
  files: [
    {
      name: 'AdipiscingMolestieHendrerit.mp3',
      owner: 1,
      description: '',
      active: false
    }, {
      name: 'AdipiscingElit.mpeg',
      owner: 2,
      description: '',
      active: true
    }
  ],
  users: [
    {
      id: 1,
      firstName: 'Ken',
      lastName: 'Cudiff',
      password: '9gxtR9vH',
      email: 'kcudiff0@nymag.com',
      gender: 'Male',
      active: true
    }, {
      id: 2,
      firstName: 'Ram',
      lastName: 'Piddlesden',
      password: 'cgsi5hrRee3',
      email: 'rpiddlesden1@devhub.com',
      gender: 'Male',
      active: true
    }, {
      id: 3,
      firstName: 'Giavani',
      lastName: 'Persehouse',
      password: 'TBSPaKnO',
      email: 'gpersehouse2@ibm.com',
      gender: 'Male',
      active: true
    }, {
      id: 4,
      firstName: 'Rubetta',
      lastName: 'Marten',
      password: 'zCennDGoKOMu',
      email: 'rmarten3@cbslocal.com',
      gender: 'Female',
      active: false
    }, {
      id: 5,
      firstName: 'Gwenora',
      lastName: 'Garfath',
      password: 'exF3Cnk2C',
      email: 'ggarfath4@edublogs.org',
      gender: 'Female',
      active: false
    }, {
      id: 6,
      firstName: 'Marleah',
      lastName: 'Bertelsen',
      password: 'zkKvNN1',
      email: 'mbertelsen5@xinhuanet.com',
      gender: 'Female',
      active: false
    }, {
      id: 7,
      firstName: 'Carlene',
      lastName: 'Gun',
      password: 'vuQjnC',
      email: 'cgun6@chronoengine.com',
      gender: 'Female',
      active: true
    }, {
      id: 8,
      firstName: 'Ferdie',
      lastName: 'Belt',
      password: 'JwvCDP',
      email: 'fbelt7@merriam-webster.com',
      gender: 'Male',
      active: false
    }, {
      id: 9,
      firstName: 'Leanor',
      lastName: 'Hards',
      password: 'Vo18HlZN2DA',
      email: 'lhards8@examiner.com',
      gender: 'Female',
      active: false
    }, {
      id: 10,
      firstName: 'Lanny',
      lastName: 'McAllen',
      password: '24EAW2yy',
      email: 'lmcallen9@plala.or.jp',
      gender: 'Male',
      active: false
    }
  ],
  products: [
    {
      name: 'Muffin Carrot - Individual',
      description: 'Helianthemum georgianum Chapm.',
      price: 58,
      active: false
    }, {
      name: 'Green Scrubbie Pad H.duty',
      description: 'Forestiera rhamnifolia Griseb.',
      price: 63,
      active: false
    }, {
      name: 'Pastry - Chocolate Marble Tea',
      description: 'Draba aurea Vahl ex Hornem.',
      price: 58,
      active: true
    }, {
      name: 'Bacardi Breezer - Tropical',
      description: 'Penstemon personatus D.D. Keck',
      price: 97,
      active: true
    }, {
      name: 'Energy Drink Bawls',
      description: 'Parmeliella ruderatula (Nyl.) Hasse',
      price: 63,
      active: false
    }, {
      name: 'Turkey - Ground. Lean',
      description: 'Thouinia striata Radlk. var. portoricensis (Radlk.) Votava & Alain',
      price: 30,
      active: true
    }, {
      name: 'Nectarines',
      description: 'Senecio flaccidus Less. var. monoensis (Greene) B.L. Turner & T.M. Barkley',
      price: 95,
      active: true
    }, {
      name: 'Juice - V8 Splash',
      description: 'Echeandia reflexa (Cav.) Rose [excluded]',
      price: 8,
      active: false
    }, {
      name: 'Wine - Sake',
      description: 'Entosthodon fascicularis (Hedw.) Müll. Hal.',
      price: 2,
      active: false
    }, {
      name: 'Oil - Hazelnut',
      description: 'Leymus pacificus (Gould) D.R. Dewey',
      price: 14,
      active: true
    }
  ],
  orders: [
    {
      number: 1,
      user: 1,
      status: 'prepared',
      items: [
        {
          name: 'Pepper - Chipotle, Canned'
        },
        {
          name: 'Crab - Meat'
        },
        {
          name: 'Sage Ground Wiberg'
        },
        {
          name: 'Yams'
        }
      ],
      price: 594,
      active: true,
      createdAt: '2020-07-31T01:40:54Z'
    }, {
      number: 2,
      user: 2,
      status: 'prepared',
      items: [
        {
          name: 'Flax Seed'
        },
        {
          name: 'Salt - Celery'
        }
      ],
      price: 294,
      active: false,
      createdAt: '2020-05-05T19:31:59Z'
    }, {
      number: 3,
      user: 3,
      status: 'out',
      items: [
        {
          name: 'Peach - Halves'
        },
        {
          name: 'Bread - Roll, Soft White Round'
        }
      ],
      price: 411,
      active: false,
      createdAt: '2020-03-01T15:23:37Z'
    }, {
      number: 4,
      user: 4,
      status: 'delivered',
      items: [
        {
          name: 'Beer - Paulaner Hefeweisse'
        },
        {
          name: 'Lumpfish Black'
        },
        {
          name: 'Sansho Powder'
        },
        {
          name: 'Blueberries'
        },
        {
          name: 'Coffee - Hazelnut Cream'
        }
      ],
      price: 411,
      active: false,
      createdAt: '2019-11-11T00:52:24Z'
    }, {
      number: 5,
      user: 5,
      status: 'out',
      items: [
        {
          name: 'Orange Roughy 6/8 Oz'
        },
        {
          name: 'Soho Lychee Liqueur'
        }
      ],
      price: 240,
      active: false,
      createdAt: '2020-01-03T03:37:32Z'
    }, {
      number: 6,
      user: 6,
      status: 'out',
      items: [
        {
          name: 'Onions - Cooking'
        },
        {
          name: 'Yukon Jack'
        },
        {
          name: 'Cheese - Swiss Sliced'
        }
      ],
      price: 412,
      active: false,
      createdAt: '2020-03-07T12:59:01Z'
    }, {
      number: 7,
      user: 7,
      status: 'out',
      items: [
        {
          name: 'Pineapple - Regular'
        },
        {
          name: 'Pepper - Chipotle, Canned'
        },
        {
          name: 'Bagel - Plain'
        },
        {
          name: 'Wine - Savigny - Les - Beaune'
        },
        {
          name: 'Veal - Brisket, Provimi,bnls'
        }
      ],
      price: 813,
      active: false,
      createdAt: '2020-02-03T19:11:40Z'
    }, {
      number: 8,
      user: 8,
      status: 'completed',
      items: [
        {
          name: 'Wine - White, Gewurtzraminer'
        },
        {
          name: 'Capon - Breast, Wing On'
        },
        {
          name: 'Flour - Cake'
        },
        {
          name: 'Veal - Tenderloin, Untrimmed'
        },
        {
          name: 'Olives - Kalamata'
        }
      ],
      price: 390,
      active: true,
      createdAt: '2019-10-30T03:54:15Z'
    }, {
      number: 9,
      user: 9,
      status: 'prepared',
      items: [
        {
          name: 'Flower - Carnations'
        }
      ],
      price: 263,
      active: false,
      createdAt: '2020-04-14T21:13:36Z'
    }, {
      number: 10,
      user: 10,
      status: 'prepared',
      items: [
        {
          name: 'Corn Shoots'
        },
        {
          name: 'Pickles - Gherkins'
        },
        {
          name: 'Lemon Balm - Fresh'
        }
      ],
      price: 987,
      active: false,
      createdAt: '2020-03-06T08:43:21Z'
    }
  ]
};
