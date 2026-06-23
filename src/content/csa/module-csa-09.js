// AUTO-AUTHORED AP module. Edit via the content pipeline.
export default {
  "project": {
    "id": "csa-09",
    "title": "Inheritance",
    "description": "Master class inheritance in Java by building hierarchies with extends, super, method overriding, polymorphism, and the universal Object class.",
    "difficulty": "intermediate",
    "category": "apcsa",
    "order": 209,
    "track": "apcsa",
    "unit": "Unit 9 — Inheritance",
    "tags": [
      "java",
      "oop",
      "inheritance"
    ]
  },
  "lessons": [
    {
      "id": "csa-09-l1",
      "project_id": "csa-09",
      "order": 1,
      "title": "Extending a Class",
      "explanation": "## Why Inheritance?\n\n**Inheritance** lets one class reuse the fields and methods of another. Instead of copying code, you say \"this new class **is a** kind of that existing class.\" In Java, the keyword `extends` creates this relationship.\n\nThe class being extended is the **superclass** (also called the parent or base class). The class doing the extending is the **subclass** (child or derived class). A subclass automatically receives all `public` and `protected` members of its superclass.\n\n## The extends Keyword\n\n```java\npublic class Animal {\n    public void breathe() {\n        System.out.println(\"breathing\");\n    }\n}\n\npublic class Dog extends Animal {\n    public void bark() {\n        System.out.println(\"woof\");\n    }\n}\n```\n\nHere `Dog` **inherits** `breathe()` from `Animal`. A `Dog` object can call both `bark()` and `breathe()`, even though `breathe()` is written only once, in `Animal`.\n\n## Key Rules\n\n- A class can extend **only one** superclass (Java has single inheritance).\n- The subclass **adds** new behavior while keeping inherited behavior.\n- `private` members exist in the subclass but cannot be accessed directly by name.\n- If you do not write `extends`, your class implicitly extends `Object`.\n\n## Reusing Code\n\nThe big win is **code reuse**. If ten kinds of animals all breathe the same way, you write `breathe()` once in `Animal`. Every subclass gets it for free, and a fix in one place fixes all of them.\n\n```java\nDog d = new Dog();\nd.breathe(); // inherited\nd.bark();    // own method\n```\n\nThink of inheritance as building a family tree of types. The closer to the root, the more general the class; the further down, the more specialized. In this lesson you will read a name from input and create a subclass object that uses an inherited method to greet, proving the inherited code really runs.",
      "key_terms": [
        {
          "term": "extends",
          "definition": "The Java keyword that makes one class inherit from another."
        },
        {
          "term": "superclass",
          "definition": "The parent class whose members are inherited by a subclass."
        },
        {
          "term": "subclass",
          "definition": "The child class that extends a superclass and gains its members."
        }
      ],
      "inline_quizzes": [
        {
          "question": "How many direct superclasses can a Java class extend?",
          "options": [
            "Zero",
            "Exactly one",
            "Up to two",
            "Unlimited"
          ],
          "correct_index": 1,
          "explanation": "Java supports single inheritance: a class may extend exactly one superclass."
        }
      ],
      "quiz_questions": [
        {
          "question": "If class Dog extends Animal, which method can a Dog object call?",
          "options": [
            "Only methods defined in Dog",
            "Only methods defined in Animal",
            "Public methods from both Animal and Dog",
            "No methods until super() is called"
          ],
          "correct_index": 2,
          "explanation": "A subclass inherits the public/protected members of its superclass and adds its own, so both are callable."
        },
        {
          "question": "A class written with no 'extends' clause implicitly extends which class?",
          "options": [
            "Object",
            "Main",
            "System",
            "Nothing"
          ],
          "correct_index": 0,
          "explanation": "Every class without an explicit superclass implicitly extends java.lang.Object."
        }
      ],
      "challenge_title": "Inherited Greeting",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\nclass Speaker {\n    // TODO: add a public method greet(String name) that prints \"Hello, \" + name\n}\n\nclass FriendlySpeaker extends Speaker {\n    // inherits greet\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String name = sc.nextLine();\n        // TODO: create a FriendlySpeaker and call greet(name)\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\nclass Speaker {\n    public void greet(String name) {\n        System.out.println(\"Hello, \" + name);\n    }\n}\n\nclass FriendlySpeaker extends Speaker {\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String name = sc.nextLine();\n        FriendlySpeaker s = new FriendlySpeaker();\n        s.greet(name);\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "Ada\n",
          "expected_output": "Hello, Ada"
        },
        {
          "input": "Grace\n",
          "expected_output": "Hello, Grace"
        },
        {
          "input": "Linus\n",
          "expected_output": "Hello, Linus"
        }
      ]
    },
    {
      "id": "csa-09-l2",
      "project_id": "csa-09",
      "order": 2,
      "title": "Calling super() in Constructors",
      "explanation": "## Constructors Are Not Inherited\n\nUnlike methods, **constructors are not inherited**. Each class must define how its own objects are built. But a subclass object still contains the superclass's fields, so those fields must be initialized too. That is the job of `super()`.\n\n## The super() Call\n\n`super(...)` invokes a constructor of the **superclass**. It must be the **first statement** in the subclass constructor.\n\n```java\npublic class Animal {\n    private String name;\n    public Animal(String name) {\n        this.name = name;\n    }\n    public String getName() { return name; }\n}\n\npublic class Dog extends Animal {\n    private String breed;\n    public Dog(String name, String breed) {\n        super(name);      // build the Animal part first\n        this.breed = breed;\n    }\n}\n```\n\nWhen you create a `Dog`, Java first runs the `Animal` constructor (via `super(name)`) to set up the inherited `name` field, then finishes the `Dog`-specific setup.\n\n## When super() Is Implicit\n\nIf you do **not** write `super(...)`, Java automatically inserts a call to the superclass's **no-argument constructor** `super()`. This means:\n\n- If the superclass has a no-arg constructor, you can omit `super()` safely.\n- If the superclass has **only** constructors that take arguments, you **must** call `super(...)` explicitly, or the code will not compile.\n\n## Order of Construction\n\nConstruction flows from the top of the hierarchy down:\n\n- Superclass constructor runs first.\n- Then the subclass constructor body runs.\n\nThis guarantees inherited fields are ready before the subclass touches them. In the challenge you will build a `Student` that extends `Person`, passing the name up with `super(name)` and adding a grade, then print both pieces using an inherited getter.",
      "key_terms": [
        {
          "term": "super()",
          "definition": "A call that invokes a constructor of the superclass; must be the first statement in a constructor."
        },
        {
          "term": "no-arg constructor",
          "definition": "A constructor that takes no parameters; called implicitly by super() when none is written."
        },
        {
          "term": "construction order",
          "definition": "The rule that the superclass constructor runs before the subclass constructor body."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Where must an explicit super(...) call appear in a subclass constructor?",
          "options": [
            "Anywhere in the body",
            "As the last statement",
            "As the first statement",
            "Outside the constructor"
          ],
          "correct_index": 2,
          "explanation": "An explicit super(...) call must be the very first statement of the constructor."
        }
      ],
      "quiz_questions": [
        {
          "question": "If a superclass has only a constructor that takes a String, what happens if the subclass constructor omits super(...)?",
          "options": [
            "It compiles and calls super() automatically",
            "It fails to compile because no no-arg constructor exists",
            "It runs but skips the superclass fields",
            "It throws a runtime exception"
          ],
          "correct_index": 1,
          "explanation": "Java tries to insert super() (no-arg). If no no-arg constructor exists, compilation fails."
        },
        {
          "question": "In what order do constructors run when a Dog (extends Animal) is created?",
          "options": [
            "Dog body, then Animal",
            "Animal, then Dog body",
            "Only Dog body runs",
            "They run at the same time"
          ],
          "correct_index": 1,
          "explanation": "The superclass constructor (Animal) runs first, then the subclass (Dog) constructor body."
        }
      ],
      "challenge_title": "Build a Student",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\nclass Person {\n    private String name;\n    public Person(String name) {\n        this.name = name;\n    }\n    public String getName() { return name; }\n}\n\nclass Student extends Person {\n    private int grade;\n    // TODO: constructor takes (String name, int grade); call super(name)\n    // TODO: add getGrade()\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String name = sc.nextLine();\n        int grade = sc.nextInt();\n        // TODO: create Student and print \"name in grade X\"\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\nclass Person {\n    private String name;\n    public Person(String name) {\n        this.name = name;\n    }\n    public String getName() { return name; }\n}\n\nclass Student extends Person {\n    private int grade;\n    public Student(String name, int grade) {\n        super(name);\n        this.grade = grade;\n    }\n    public int getGrade() { return grade; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String name = sc.nextLine();\n        int grade = sc.nextInt();\n        Student s = new Student(name, grade);\n        System.out.println(s.getName() + \" in grade \" + s.getGrade());\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "Maya\n10\n",
          "expected_output": "Maya in grade 10"
        },
        {
          "input": "Omar\n12\n",
          "expected_output": "Omar in grade 12"
        },
        {
          "input": "Sara\n9\n",
          "expected_output": "Sara in grade 9"
        }
      ]
    },
    {
      "id": "csa-09-l3",
      "project_id": "csa-09",
      "order": 3,
      "title": "Overriding Methods",
      "explanation": "## Replacing Inherited Behavior\n\nSometimes a subclass needs to do a job **differently** than its superclass. **Method overriding** lets a subclass provide its own version of a method that already exists in the superclass. The method keeps the **same name, parameters, and return type**, but supplies a new body.\n\n## How Overriding Works\n\n```java\npublic class Animal {\n    public String speak() {\n        return \"some sound\";\n    }\n}\n\npublic class Dog extends Animal {\n    @Override\n    public String speak() {\n        return \"woof\";\n    }\n}\n```\n\nNow `new Dog().speak()` returns `\"woof\"`, while `new Animal().speak()` returns `\"some sound\"`. The subclass version **replaces** the inherited one for `Dog` objects.\n\n## The @Override Annotation\n\nWriting `@Override` above the method is optional but strongly recommended. It tells the compiler \"I intend to override.\" If you misspell the name or get the parameters wrong, the compiler reports an error instead of silently creating a brand-new method.\n\n## Override vs. Overload\n\nDo not confuse these:\n\n- **Overriding**: same signature, in a **subclass**, replaces inherited behavior.\n- **Overloading**: same name but **different parameters**, usually in the same class.\n\n```java\nvoid print(int x)    { } // overload\nvoid print(String s) { } // overload (different params)\n```\n\n## Signature Rules\n\nTo legally override:\n\n- The method name and parameter list must match exactly.\n- The return type must match (or be a subtype).\n- You cannot make the access **more** restrictive (e.g., `public` cannot become `private`).\n\nOverriding is the foundation of polymorphism, which you will study soon. In this challenge you will override a `describe()` method so a `Cat` describes itself differently from a generic `Animal`, and print both descriptions.",
      "key_terms": [
        {
          "term": "overriding",
          "definition": "Giving a subclass its own version of a superclass method with the same signature."
        },
        {
          "term": "@Override",
          "definition": "An annotation that asks the compiler to verify a method actually overrides a superclass method."
        },
        {
          "term": "signature",
          "definition": "The method name and parameter list that must match for overriding to occur."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What distinguishes overriding from overloading?",
          "options": [
            "Overriding uses different parameters; overloading uses the same",
            "Overriding keeps the same signature in a subclass; overloading changes the parameters",
            "They are the same thing",
            "Overloading requires the @Override annotation"
          ],
          "correct_index": 1,
          "explanation": "Overriding keeps the identical signature in a subclass; overloading changes the parameter list."
        }
      ],
      "quiz_questions": [
        {
          "question": "What does the @Override annotation do?",
          "options": [
            "Makes a method run faster",
            "Forces the JVM to skip the superclass method",
            "Tells the compiler to verify the method really overrides a superclass method",
            "Automatically calls super.method()"
          ],
          "correct_index": 2,
          "explanation": "@Override is a compile-time check confirming the method overrides an inherited one."
        },
        {
          "question": "For Dog to override Animal's speak(), the Dog version must have:",
          "options": [
            "A different return type and name",
            "The same name, parameters, and compatible return type",
            "Different parameters",
            "A private access modifier"
          ],
          "correct_index": 1,
          "explanation": "Overriding requires matching name and parameters with a compatible return type and no narrower access."
        }
      ],
      "challenge_title": "Override describe()",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\nclass Animal {\n    public String describe() {\n        return \"I am an animal\";\n    }\n}\n\nclass Cat extends Animal {\n    // TODO: override describe() to return \"I am a cat\"\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Animal a = new Animal();\n        Cat c = new Cat();\n        System.out.println(a.describe());\n        System.out.println(c.describe());\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\nclass Animal {\n    public String describe() {\n        return \"I am an animal\";\n    }\n}\n\nclass Cat extends Animal {\n    @Override\n    public String describe() {\n        return \"I am a cat\";\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Animal a = new Animal();\n        Cat c = new Cat();\n        System.out.println(a.describe());\n        System.out.println(c.describe());\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "\n",
          "expected_output": "I am an animal\nI am a cat"
        },
        {
          "input": "ignored\n",
          "expected_output": "I am an animal\nI am a cat"
        },
        {
          "input": "x\n",
          "expected_output": "I am an animal\nI am a cat"
        }
      ]
    },
    {
      "id": "csa-09-l4",
      "project_id": "csa-09",
      "order": 4,
      "title": "Using super.method()",
      "explanation": "## Reusing the Parent's Version\n\nWhen you override a method, the superclass version is hidden for that subclass. But often you want to **extend** the parent's behavior, not throw it away. The expression `super.method()` calls the **superclass's version** of a method from inside the subclass.\n\n## The Pattern\n\n```java\npublic class Animal {\n    public String describe() {\n        return \"I am an animal\";\n    }\n}\n\npublic class Dog extends Animal {\n    @Override\n    public String describe() {\n        return super.describe() + \" and a dog\";\n    }\n}\n```\n\nCalling `new Dog().describe()` returns `\"I am an animal and a dog\"`. The subclass **builds on** the inherited logic by first calling `super.describe()`, then adding to it.\n\n## Why super.method() Matters\n\n- It avoids duplicating the parent's code.\n- It lets each level of the hierarchy add its own contribution.\n- It keeps the parent in charge of the part it owns.\n\nWithout `super`, writing `describe()` inside `Dog`'s own `describe()` would call the `Dog` version again, causing **infinite recursion**. The `super.` prefix is what breaks out to the parent.\n\n## super vs. this\n\n- `this.method()` calls the **current object's** version (which may be overridden).\n- `super.method()` calls the **superclass's** version, skipping the override.\n\n## A Common Use\n\nA classic example is `toString()`. A subclass often does:\n\n```java\npublic String toString() {\n    return super.toString() + \", extra info\";\n}\n```\n\nThis reuses the parent's formatting and appends new fields. In the challenge you will build a `Manager` whose `info()` calls `super.info()` from `Employee` and tacks on the manager's department, reading both values from input.",
      "key_terms": [
        {
          "term": "super.method()",
          "definition": "An expression that invokes the superclass's version of a method from within a subclass."
        },
        {
          "term": "infinite recursion",
          "definition": "What happens if an overriding method calls itself instead of using super to reach the parent."
        },
        {
          "term": "extending behavior",
          "definition": "Reusing the parent's method and adding to its result rather than replacing it entirely."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What does super.describe() call inside Dog's overridden describe()?",
          "options": [
            "Dog's describe again",
            "Animal's (superclass) describe",
            "A random method",
            "Nothing"
          ],
          "correct_index": 1,
          "explanation": "super. reaches up to the superclass version, here Animal's describe()."
        }
      ],
      "quiz_questions": [
        {
          "question": "Why might an overriding method use super.method() instead of calling the method by name?",
          "options": [
            "To make it private",
            "To reuse the parent's logic and avoid infinite recursion",
            "To skip the constructor",
            "To overload the method"
          ],
          "correct_index": 1,
          "explanation": "super.method() reuses the parent's code; calling the same name would recurse into the override forever."
        },
        {
          "question": "What is the difference between this.method() and super.method()?",
          "options": [
            "No difference",
            "this calls the current/overridden version; super calls the superclass version",
            "super calls the current version; this calls the parent",
            "Both always call the parent"
          ],
          "correct_index": 1,
          "explanation": "this. uses the object's (possibly overridden) version; super. forces the superclass version."
        }
      ],
      "challenge_title": "Manager Info",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\nclass Employee {\n    private String name;\n    public Employee(String name) { this.name = name; }\n    public String info() {\n        return \"Employee: \" + name;\n    }\n}\n\nclass Manager extends Employee {\n    private String dept;\n    public Manager(String name, String dept) {\n        super(name);\n        this.dept = dept;\n    }\n    // TODO: override info() to return super.info() + \", Dept: \" + dept\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String name = sc.nextLine();\n        String dept = sc.nextLine();\n        Manager m = new Manager(name, dept);\n        System.out.println(m.info());\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\nclass Employee {\n    private String name;\n    public Employee(String name) { this.name = name; }\n    public String info() {\n        return \"Employee: \" + name;\n    }\n}\n\nclass Manager extends Employee {\n    private String dept;\n    public Manager(String name, String dept) {\n        super(name);\n        this.dept = dept;\n    }\n    @Override\n    public String info() {\n        return super.info() + \", Dept: \" + dept;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String name = sc.nextLine();\n        String dept = sc.nextLine();\n        Manager m = new Manager(name, dept);\n        System.out.println(m.info());\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "Alice\nSales\n",
          "expected_output": "Employee: Alice, Dept: Sales"
        },
        {
          "input": "Bob\nEngineering\n",
          "expected_output": "Employee: Bob, Dept: Engineering"
        },
        {
          "input": "Cleo\nHR\n",
          "expected_output": "Employee: Cleo, Dept: HR"
        }
      ]
    },
    {
      "id": "csa-09-l5",
      "project_id": "csa-09",
      "order": 5,
      "title": "Polymorphism and Dynamic Dispatch",
      "explanation": "## One Type, Many Forms\n\n**Polymorphism** means \"many forms.\" In Java, a superclass reference can point to any subclass object. When you call an overridden method through that reference, Java runs the **subclass's** version. The actual object decides which method runs, not the reference type.\n\n## Superclass References\n\n```java\nAnimal a = new Dog();   // legal: a Dog is-a Animal\na.speak();              // runs Dog's speak(), prints \"woof\"\n```\n\nEven though `a` is declared as `Animal`, the object is really a `Dog`, so `Dog`'s overridden `speak()` runs. This selection-at-runtime is called **dynamic dispatch** (or late binding).\n\n## Why This Is Powerful\n\nYou can store mixed subclasses in one array and treat them uniformly:\n\n```java\nAnimal[] zoo = { new Dog(), new Cat(), new Animal() };\nfor (Animal x : zoo) {\n    System.out.println(x.speak());\n}\n```\n\nEach element runs its own `speak()`. You write the loop **once**, and it works for every current and future subclass. Adding a new `Bird` subclass requires **no change** to this loop.\n\n## The Rules of Dispatch\n\n- The **declared (reference) type** determines which methods you are *allowed* to call.\n- The **actual (object) type** determines which **overridden** version *runs*.\n\nSo `Animal a = new Dog();` lets you call only methods declared in `Animal`, but for overridden methods it runs `Dog`'s code.\n\n## A Subtle Point\n\nIf you call a method that exists **only** in `Dog` (like `fetch()`) through an `Animal` reference, it will **not compile**, because the compiler checks the declared type. You would need a cast first.\n\nPolymorphism is what makes inheritance truly flexible. In the challenge you will fill an `Animal[]` with different subclasses and print each one's sound in a single loop, proving dynamic dispatch picks the right method.",
      "key_terms": [
        {
          "term": "polymorphism",
          "definition": "The ability of a superclass reference to behave as any of its subclasses at runtime."
        },
        {
          "term": "dynamic dispatch",
          "definition": "Java choosing the overridden method based on the actual object type at runtime."
        },
        {
          "term": "declared type",
          "definition": "The reference type that determines which methods the compiler allows you to call."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Given Animal a = new Dog(); a.speak();, whose speak() runs if Dog overrides it?",
          "options": [
            "Animal's speak()",
            "Dog's speak()",
            "Neither; it won't compile",
            "Both run"
          ],
          "correct_index": 1,
          "explanation": "Dynamic dispatch runs the actual object's version, so Dog's speak() executes."
        }
      ],
      "quiz_questions": [
        {
          "question": "What determines which overridden method runs at runtime?",
          "options": [
            "The declared reference type",
            "The actual object type",
            "The order of declaration",
            "The variable name"
          ],
          "correct_index": 1,
          "explanation": "Dynamic dispatch selects the method based on the actual object's type."
        },
        {
          "question": "Through an Animal reference holding a Dog, what limits which methods you may call?",
          "options": [
            "The actual Dog type",
            "The declared Animal type",
            "Nothing limits it",
            "Only static methods"
          ],
          "correct_index": 1,
          "explanation": "The compiler checks the declared type (Animal), so only Animal's methods are callable without a cast."
        }
      ],
      "challenge_title": "Zoo Sounds",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\nclass Animal {\n    public String sound() { return \"...\"; }\n}\nclass Dog extends Animal {\n    public String sound() { return \"woof\"; }\n}\nclass Cat extends Animal {\n    public String sound() { return \"meow\"; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // TODO: make an Animal[] with a Dog, a Cat, and an Animal\n        // TODO: loop and print each sound() on its own line\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\nclass Animal {\n    public String sound() { return \"...\"; }\n}\nclass Dog extends Animal {\n    public String sound() { return \"woof\"; }\n}\nclass Cat extends Animal {\n    public String sound() { return \"meow\"; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Animal[] zoo = { new Dog(), new Cat(), new Animal() };\n        for (Animal a : zoo) {\n            System.out.println(a.sound());\n        }\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "\n",
          "expected_output": "woof\nmeow\n..."
        },
        {
          "input": "anything\n",
          "expected_output": "woof\nmeow\n..."
        },
        {
          "input": "1\n",
          "expected_output": "woof\nmeow\n..."
        }
      ]
    },
    {
      "id": "csa-09-l6",
      "project_id": "csa-09",
      "order": 6,
      "title": "Overriding toString()",
      "explanation": "## The Object Class\n\nEvery class in Java ultimately extends **`Object`**, the root of the entire class hierarchy. Because of this, every object inherits a small set of methods, including `toString()` and `equals()`. This lesson focuses on **`toString()`**.\n\n## What toString() Does\n\n`toString()` returns a `String` description of an object. Java calls it **automatically** when you:\n\n- print an object: `System.out.println(obj);`\n- concatenate an object with a string: `\"value: \" + obj`\n\nThe default `Object.toString()` returns something ugly like `Point@1b6d3586` (class name + hash code). That is rarely useful, so you **override** it.\n\n## Overriding It\n\n```java\npublic class Point {\n    private int x, y;\n    public Point(int x, int y) { this.x = x; this.y = y; }\n\n    @Override\n    public String toString() {\n        return \"(\" + x + \", \" + y + \")\";\n    }\n}\n```\n\nNow `System.out.println(new Point(3, 4));` prints `(3, 4)` instead of a memory-address-like string. The `println` method quietly calls your `toString()` behind the scenes.\n\n## Why It Matters\n\n- Makes debugging output readable.\n- Lets objects describe themselves consistently everywhere they are printed.\n- Required by the AP CSA exam's expectation that you can write a clean `toString()`.\n\n## Rules\n\n- Signature must be exactly `public String toString()`.\n- Use `@Override` to catch mistakes.\n- It should **return** a string, not print one.\n\nA common bug is printing inside `toString()` instead of returning. Always `return` the description and let the caller decide what to do with it. In the challenge you will create a `Point` class, override `toString()` to format coordinates, read two numbers, and print the point directly so the automatic call to `toString()` does the formatting.",
      "key_terms": [
        {
          "term": "Object",
          "definition": "The root superclass of every Java class, providing toString(), equals(), and more."
        },
        {
          "term": "toString()",
          "definition": "A method that returns a String description, called automatically when printing or concatenating an object."
        },
        {
          "term": "default toString",
          "definition": "Object's version that returns class name plus hash code, usually overridden for readability."
        }
      ],
      "inline_quizzes": [
        {
          "question": "When is toString() called automatically?",
          "options": [
            "Never",
            "When an object is printed or concatenated with a string",
            "Only inside constructors",
            "Only when explicitly typed out"
          ],
          "correct_index": 1,
          "explanation": "println and string concatenation both invoke toString() automatically."
        }
      ],
      "quiz_questions": [
        {
          "question": "What is the correct signature for overriding toString()?",
          "options": [
            "public void toString()",
            "public String toString()",
            "public String toString(String s)",
            "private String toString()"
          ],
          "correct_index": 1,
          "explanation": "It must be public String toString() with no parameters to override Object's method."
        },
        {
          "question": "A toString() method should:",
          "options": [
            "Print the description with System.out.println",
            "Return a String description",
            "Modify the object's fields",
            "Return void"
          ],
          "correct_index": 1,
          "explanation": "toString() returns a String; the caller decides whether to print it."
        }
      ],
      "challenge_title": "Point toString",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\nclass Point {\n    private int x, y;\n    public Point(int x, int y) { this.x = x; this.y = y; }\n    // TODO: override toString() to return \"(x, y)\"\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int x = sc.nextInt();\n        int y = sc.nextInt();\n        Point p = new Point(x, y);\n        System.out.println(p);\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\nclass Point {\n    private int x, y;\n    public Point(int x, int y) { this.x = x; this.y = y; }\n    @Override\n    public String toString() {\n        return \"(\" + x + \", \" + y + \")\";\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int x = sc.nextInt();\n        int y = sc.nextInt();\n        Point p = new Point(x, y);\n        System.out.println(p);\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "3 4\n",
          "expected_output": "(3, 4)"
        },
        {
          "input": "0 0\n",
          "expected_output": "(0, 0)"
        },
        {
          "input": "-2 7\n",
          "expected_output": "(-2, 7)"
        }
      ]
    },
    {
      "id": "csa-09-l7",
      "project_id": "csa-09",
      "order": 7,
      "title": "Overriding equals()",
      "explanation": "## Comparing Objects\n\nThe other key inherited method from `Object` is **`equals()`**. By default, `Object.equals()` compares **references**, meaning two objects are equal only if they are the **same object in memory**. Often we want **value equality** instead: two distinct objects are equal if their fields match.\n\n## == vs equals\n\n- `==` compares **references** (are these the same object?).\n- `.equals()` compares whatever the method defines (often field values).\n\n```java\nPoint a = new Point(1, 2);\nPoint b = new Point(1, 2);\nSystem.out.println(a == b);      // false: different objects\nSystem.out.println(a.equals(b)); // depends on equals()\n```\n\n## Overriding equals()\n\nThe standard pattern takes an `Object` parameter, checks the type, casts, and compares fields:\n\n```java\n@Override\npublic boolean equals(Object o) {\n    if (!(o instanceof Point)) return false;\n    Point other = (Point) o;\n    return this.x == other.x && this.y == other.y;\n}\n```\n\nStep by step:\n\n- **`instanceof`** confirms the argument is actually a `Point` (and not null).\n- The **cast** `(Point) o` lets you reach the other object's fields.\n- The comparison returns `true` only when all relevant fields match.\n\n## Why the Object Parameter?\n\nThe signature must be `public boolean equals(Object o)` to truly override the inherited method. If you wrote `equals(Point p)` instead, you would be **overloading**, not overriding, and collections like `ArrayList.contains` would not use it.\n\n## Common Pitfalls\n\n- Forgetting `instanceof` causes a `ClassCastException` when comparing to other types.\n- Using `==` on `String` fields compares references; use `.equals()` for strings.\n\nIn the challenge you will build a `Point` with a correct `equals()`, read two points from input, and print whether they are equal by value.",
      "key_terms": [
        {
          "term": "equals()",
          "definition": "An Object method, often overridden, that defines value equality between two objects."
        },
        {
          "term": "==",
          "definition": "The operator that compares references to check if two variables point to the same object."
        },
        {
          "term": "instanceof",
          "definition": "An operator that tests whether an object is an instance of a given type before casting."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What does the == operator compare for objects?",
          "options": [
            "Field values",
            "References (same object or not)",
            "String lengths",
            "Hash codes only"
          ],
          "correct_index": 1,
          "explanation": "== checks reference identity, not field-by-field value equality."
        }
      ],
      "quiz_questions": [
        {
          "question": "Why must equals take an Object parameter to override Object.equals?",
          "options": [
            "For speed",
            "Otherwise it overloads instead of overrides, and collections ignore it",
            "Because Object has no equals method",
            "To avoid using instanceof"
          ],
          "correct_index": 1,
          "explanation": "Matching the exact signature public boolean equals(Object o) is required to override; otherwise it just overloads."
        },
        {
          "question": "What is the purpose of instanceof inside equals()?",
          "options": [
            "To print the object",
            "To safely confirm the argument's type before casting",
            "To compare hash codes",
            "To call the constructor"
          ],
          "correct_index": 1,
          "explanation": "instanceof verifies the argument is the right type (and non-null) so the cast is safe."
        }
      ],
      "challenge_title": "Point Equality",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\nclass Point {\n    private int x, y;\n    public Point(int x, int y) { this.x = x; this.y = y; }\n    // TODO: override equals(Object o) to compare x and y\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        Point a = new Point(sc.nextInt(), sc.nextInt());\n        Point b = new Point(sc.nextInt(), sc.nextInt());\n        System.out.println(a.equals(b));\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\nclass Point {\n    private int x, y;\n    public Point(int x, int y) { this.x = x; this.y = y; }\n    @Override\n    public boolean equals(Object o) {\n        if (!(o instanceof Point)) return false;\n        Point other = (Point) o;\n        return this.x == other.x && this.y == other.y;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        Point a = new Point(sc.nextInt(), sc.nextInt());\n        Point b = new Point(sc.nextInt(), sc.nextInt());\n        System.out.println(a.equals(b));\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "1 2 1 2\n",
          "expected_output": "true"
        },
        {
          "input": "1 2 3 4\n",
          "expected_output": "false"
        },
        {
          "input": "5 5 5 6\n",
          "expected_output": "false"
        }
      ]
    },
    {
      "id": "csa-09-l8",
      "project_id": "csa-09",
      "order": 8,
      "title": "Is-A Hierarchies in Action",
      "explanation": "## Designing with Is-A\n\nInheritance models the **is-a relationship**: a subclass *is a* kind of its superclass. A `Square` *is a* `Shape`; a `Dog` *is an* `Animal`. If \"X is a Y\" sounds natural in English, inheritance is usually the right tool. If it sounds wrong, prefer **composition** (has-a) instead.\n\n## Building a Hierarchy\n\nThis capstone combines everything: `extends`, `super(...)`, overriding, `super.method()`, and polymorphism. Consider a shape hierarchy:\n\n```java\npublic class Shape {\n    public double area() { return 0.0; }\n}\n\npublic class Rectangle extends Shape {\n    private double w, h;\n    public Rectangle(double w, double h) { this.w = w; this.h = h; }\n    @Override\n    public double area() { return w * h; }\n}\n\npublic class Square extends Rectangle {\n    public Square(double side) {\n        super(side, side); // a square is-a rectangle with equal sides\n    }\n}\n```\n\nNotice the chain: `Square` *is a* `Rectangle`, which *is a* `Shape`. `Square` calls `super(side, side)` to reuse `Rectangle`'s construction, and it inherits `area()` without rewriting it.\n\n## Polymorphic Totals\n\nBecause every subclass *is a* `Shape`, you can total their areas uniformly:\n\n```java\nShape[] shapes = { new Rectangle(2, 3), new Square(4) };\ndouble total = 0;\nfor (Shape s : shapes) total += s.area();\n```\n\nDynamic dispatch calls the right `area()` for each object. This is the payoff of a well-designed is-a hierarchy: general code that works for any specialized type.\n\n## Substitutability\n\nA subclass object can be used **anywhere** its superclass is expected. This is the **Liskov substitution** idea: passing a `Square` where a `Shape` is required must always be safe.\n\nIn the final challenge you will read several rectangles, store them in a `Shape[]`, and print the **sum of their areas** using polymorphism, tying together extends, super, overriding, and dynamic dispatch.",
      "key_terms": [
        {
          "term": "is-a relationship",
          "definition": "The semantic test for inheritance: a subclass should genuinely be a kind of its superclass."
        },
        {
          "term": "substitutability",
          "definition": "The principle that a subclass object can be used wherever its superclass is expected."
        },
        {
          "term": "hierarchy",
          "definition": "A multi-level chain of classes where each extends a more general one above it."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Which relationship is best modeled by inheritance?",
          "options": [
            "A Car has-a Engine",
            "A Square is-a Shape",
            "A List has-a element",
            "A Wallet has-a Money"
          ],
          "correct_index": 1,
          "explanation": "Inheritance models is-a relationships; has-a relationships call for composition."
        }
      ],
      "quiz_questions": [
        {
          "question": "Why can a Shape[] hold Rectangle and Square objects?",
          "options": [
            "Because arrays ignore types",
            "Because Rectangle and Square are-a Shape via inheritance",
            "Because of overloading",
            "Because of casting at compile time"
          ],
          "correct_index": 1,
          "explanation": "Subclass objects satisfy the is-a relationship, so they fit a superclass-typed array."
        },
        {
          "question": "When you call area() on each element of a Shape[] holding mixed subclasses, which version runs?",
          "options": [
            "Always Shape's area()",
            "The actual subclass's overridden area() via dynamic dispatch",
            "A random one",
            "None compile"
          ],
          "correct_index": 1,
          "explanation": "Dynamic dispatch runs each object's own overridden area()."
        }
      ],
      "challenge_title": "Total Area",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\nclass Shape {\n    public int area() { return 0; }\n}\nclass Rectangle extends Shape {\n    private int w, h;\n    public Rectangle(int w, int h) { this.w = w; this.h = h; }\n    // TODO: override area() to return w * h\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        Shape[] shapes = new Shape[n];\n        for (int i = 0; i < n; i++) {\n            int w = sc.nextInt();\n            int h = sc.nextInt();\n            shapes[i] = new Rectangle(w, h);\n        }\n        // TODO: sum the areas polymorphically and print the total\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\nclass Shape {\n    public int area() { return 0; }\n}\nclass Rectangle extends Shape {\n    private int w, h;\n    public Rectangle(int w, int h) { this.w = w; this.h = h; }\n    @Override\n    public int area() { return w * h; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        Shape[] shapes = new Shape[n];\n        for (int i = 0; i < n; i++) {\n            int w = sc.nextInt();\n            int h = sc.nextInt();\n            shapes[i] = new Rectangle(w, h);\n        }\n        int total = 0;\n        for (Shape s : shapes) {\n            total += s.area();\n        }\n        System.out.println(total);\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "2\n2 3\n4 5\n",
          "expected_output": "26"
        },
        {
          "input": "1\n10 10\n",
          "expected_output": "100"
        },
        {
          "input": "3\n1 1\n2 2\n3 3\n",
          "expected_output": "14"
        }
      ]
    }
  ]
}
