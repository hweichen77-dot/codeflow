// AUTO-AUTHORED AP module. Edit via the content pipeline.
export default {
  "project": {
    "id": "csa-09",
    "title": "Inheritance",
    "description": "Covers building class hierarchies in Java using extends, super, method overriding, polymorphism, and the Object class methods.",
    "difficulty": "intermediate",
    "category": "apcsa",
    "order": 209,
    "track": "apcsa",
    "unit": "Unit 9 — Inheritance",
    "tags": [
      "extends",
      "overriding",
      "polymorphism"
    ]
  },
  "lessons": [
    {
      "id": "csa-09-l1",
      "project_id": "csa-09",
      "order": 1,
      "title": "Extends and super",
      "explanation": "## What Is Inheritance?\n\n**Inheritance** lets a new class reuse the fields and methods of an existing class. The existing class is the **superclass** (parent) and the new class is the **subclass** (child). In Java you create this relationship with the **extends** keyword. The subclass automatically gets every `public` and `protected` member of the superclass, so you write the shared code once.\n\nWe describe inheritance as an **is-a relationship**: a `Dog` is-a `Animal`, so `Dog extends Animal` makes sense.\n\n```java\npublic class Animal {\n    private String name;\n    public Animal(String name) { this.name = name; }\n    public String getName() { return name; }\n}\n\npublic class Dog extends Animal {\n    public Dog(String name) {\n        super(name); // call Animal's constructor\n    }\n}\n```\n\n## The super Keyword\n\nThe **super** keyword refers to the superclass. It has two uses:\n\n- **super(args)** calls a superclass **constructor**. It must be the **first statement** in the subclass constructor.\n- **super.method()** calls a superclass **method**, even when the subclass overrides it.\n\nIf you do not write an explicit `super(...)` call, Java inserts a hidden `super()` that calls the **no-argument constructor** of the parent. If the parent has no no-arg constructor, you must call `super(...)` yourself, or the code will not compile.\n\n## Why private Fields Need super\n\nBecause `name` above is `private`, the `Dog` subclass cannot touch it directly. The only way to initialize it is by passing it up to `Animal` through `super(name)`. This is a common AP exam pattern: the subclass constructor takes parameters and forwards the parent's portion with `super`.\n\n## Key Points to Remember\n\n- A subclass extends exactly **one** superclass (Java has single inheritance).\n- Constructors are **not** inherited, but a subclass constructor can call one with `super`.\n- `private` members exist in the subclass object but are accessed only through inherited public methods.\n\nInheritance reduces duplication and is the foundation for **polymorphism**, which you will study next.",
      "key_terms": [
        {
          "term": "extends",
          "definition": "Java keyword that declares a subclass which inherits the members of a named superclass."
        },
        {
          "term": "super",
          "definition": "Keyword used to call a superclass constructor (super(args)) or a superclass method (super.method())."
        },
        {
          "term": "is-a relationship",
          "definition": "The conceptual test for inheritance: a subclass is-a kind of its superclass, e.g. a Dog is-a Animal."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Where must a super(args) constructor call appear inside a subclass constructor?",
          "options": [
            "As the last statement",
            "Anywhere in the body",
            "As the first statement",
            "Outside the constructor"
          ],
          "correct_index": 2,
          "explanation": "A call to super(args) must be the first statement in the subclass constructor; otherwise the code does not compile."
        }
      ],
      "quiz_questions": [
        {
          "question": "What happens if a subclass constructor does not explicitly call super(...)?",
          "options": [
            "The code fails to compile no matter what",
            "Java inserts a hidden call to the superclass no-arg constructor",
            "The superclass fields stay uninitialized forever",
            "The subclass cannot be instantiated"
          ],
          "correct_index": 1,
          "explanation": "Java automatically inserts super() (the no-arg constructor). If the parent lacks a no-arg constructor, you must call super(...) yourself."
        },
        {
          "question": "Why can a subclass usually not assign directly to a private field declared in its superclass?",
          "options": [
            "private fields are deleted in subclasses",
            "private members are accessible only within the class that declares them",
            "Subclasses do not contain the field at all",
            "Only static fields are inherited"
          ],
          "correct_index": 1,
          "explanation": "private restricts access to the declaring class. The field exists in the object but must be set through a constructor (via super) or a public method."
        }
      ],
      "challenge_title": "Build an Animal Hierarchy",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\nclass Animal {\n    private String name;\n    public Animal(String name) { this.name = name; }\n    public String getName() { return name; }\n}\n\nclass Dog extends Animal {\n    // TODO: add a constructor that forwards name to the superclass using super\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String n = sc.nextLine();\n        // TODO: create a Dog and print its name followed by \" says Woof\"\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\nclass Animal {\n    private String name;\n    public Animal(String name) { this.name = name; }\n    public String getName() { return name; }\n}\n\nclass Dog extends Animal {\n    public Dog(String name) {\n        super(name);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String n = sc.nextLine();\n        Dog d = new Dog(n);\n        System.out.println(d.getName() + \" says Woof\");\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "Rex",
          "expected_output": "Rex says Woof"
        },
        {
          "input": "Bella",
          "expected_output": "Bella says Woof"
        },
        {
          "input": "Max",
          "expected_output": "Max says Woof"
        }
      ]
    },
    {
      "id": "csa-09-l2",
      "project_id": "csa-09",
      "order": 2,
      "title": "Overriding Methods",
      "explanation": "## Replacing Inherited Behavior\n\nA subclass inherits its parent's methods, but sometimes it needs different behavior. **Method overriding** is providing a new implementation in the subclass for a method that already exists in the superclass. The new method must have the **same name, same parameter list, and a compatible return type**.\n\n```java\npublic class Shape {\n    public double area() { return 0.0; }\n    public String describe() { return \"Area = \" + area(); }\n}\n\npublic class Square extends Shape {\n    private double side;\n    public Square(double side) { this.side = side; }\n    @Override\n    public double area() { return side * side; }\n}\n```\n\nWhen you call `describe()` on a `Square`, the inherited `describe()` calls `area()` — but Java uses the **Square** version of `area()`. This run-time choice of the correct method is the heart of polymorphism.\n\n## Override vs Overload\n\nDo not confuse these two:\n\n- **Overriding** = same signature, in a **subclass**, replaces parent behavior.\n- **Overloading** = same method name but **different parameters**, in the **same class**.\n\n## The @Override Annotation\n\nWriting **@Override** above the method is optional but strongly recommended. It tells the compiler you intend to override. If you misspell the name or get the parameters wrong, the compiler reports an error instead of silently creating a brand-new method.\n\n## Calling the Parent Version\n\nAn override does not have to throw away the parent's work. Use **super.method()** to run the superclass version and then add to it:\n\n```java\n@Override\npublic String describe() {\n    return \"Square: \" + super.describe();\n}\n```\n\n## Rules and Restrictions\n\n- You **cannot** reduce visibility when overriding (e.g. a `public` method cannot become `private`).\n- `static` methods are **hidden**, not overridden; the AP subset focuses on instance method overriding.\n- The overriding method belongs to the subclass and is selected based on the object's **actual type at run time**, not the declared variable type.\n\nMastering overriding is what makes the next topic, polymorphism, possible.",
      "key_terms": [
        {
          "term": "method overriding",
          "definition": "Defining a subclass method with the same signature as a superclass method to replace its behavior."
        },
        {
          "term": "@Override",
          "definition": "An optional annotation that asks the compiler to verify the method actually overrides a superclass method."
        },
        {
          "term": "overloading",
          "definition": "Defining multiple methods with the same name but different parameter lists in the same class; distinct from overriding."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Which statement correctly describes an overriding method?",
          "options": [
            "It has the same name but different parameters in the same class",
            "It has the same signature as a superclass method and replaces its behavior",
            "It must be declared static",
            "It must have a different return type than the parent"
          ],
          "correct_index": 1,
          "explanation": "Overriding requires the same signature (name and parameters) as the superclass method, replacing the inherited behavior."
        }
      ],
      "quiz_questions": [
        {
          "question": "What is the main benefit of writing the @Override annotation?",
          "options": [
            "It makes the method run faster",
            "It forces the method to be public",
            "The compiler verifies the method truly overrides a superclass method, catching typos",
            "It automatically calls the superclass version"
          ],
          "correct_index": 2,
          "explanation": "@Override is a compile-time check. If the signature does not match a superclass method, the compiler reports an error."
        },
        {
          "question": "Inside an overriding method, how do you invoke the superclass version of that same method?",
          "options": [
            "this.method()",
            "parent.method()",
            "super.method()",
            "base.method()"
          ],
          "correct_index": 2,
          "explanation": "super.method() calls the superclass implementation, letting you extend rather than fully replace the parent's behavior."
        }
      ],
      "challenge_title": "Override area for a Square",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\nclass Shape {\n    public double area() { return 0.0; }\n}\n\nclass Square extends Shape {\n    private double side;\n    public Square(double side) { this.side = side; }\n    // TODO: override area() to return side * side\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        double s = sc.nextDouble();\n        Square sq = new Square(s);\n        // TODO: print the area\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\nclass Shape {\n    public double area() { return 0.0; }\n}\n\nclass Square extends Shape {\n    private double side;\n    public Square(double side) { this.side = side; }\n    @Override\n    public double area() { return side * side; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        double s = sc.nextDouble();\n        Square sq = new Square(s);\n        System.out.println(sq.area());\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "3",
          "expected_output": "9.0"
        },
        {
          "input": "5",
          "expected_output": "25.0"
        },
        {
          "input": "2.5",
          "expected_output": "6.25"
        }
      ]
    },
    {
      "id": "csa-09-l3",
      "project_id": "csa-09",
      "order": 3,
      "title": "Polymorphism and Object Methods",
      "explanation": "## One Reference, Many Forms\n\n**Polymorphism** means a single superclass reference variable can point to objects of different subclasses, and the **correct overridden method runs automatically**. Java decides which version of a method to call based on the object's **actual run-time type**, a mechanism called **dynamic dispatch** (or late binding).\n\n```java\nShape[] shapes = { new Square(4), new Circle(2) };\nfor (Shape s : shapes) {\n    System.out.println(s.area()); // calls Square.area() then Circle.area()\n}\n```\n\nHere the variable type is `Shape`, but each call dispatches to the real object's `area()`. This lets you write one loop that handles every subclass uniformly.\n\n## The Object Superclass\n\nEvery class in Java implicitly extends **Object**, the root of the class hierarchy. That means every object inherits these methods, which subclasses commonly **override**:\n\n- **toString()** returns a `String` description. The default is an unhelpful hash like `Square@1b6d`, so you override it for readable output. `System.out.println(obj)` and string concatenation call `toString()` automatically.\n- **equals(Object other)** tests logical equality. The default compares **references** (same as `==`), so override it to compare field values.\n\n```java\n@Override\npublic String toString() {\n    return \"Square side=\" + side;\n}\n\n@Override\npublic boolean equals(Object other) {\n    if (!(other instanceof Square)) return false;\n    Square s = (Square) other;\n    return this.side == s.side;\n}\n```\n\n## Casting and instanceof\n\nA superclass variable only exposes superclass methods. To use a subclass-specific method you must **cast** down: `((Square) s).getSide()`. Use the **instanceof** operator first to confirm the type and avoid a `ClassCastException`.\n\n## Why Polymorphism Matters\n\n- Code written against the superclass works with **any** future subclass.\n- Arrays and lists can hold mixed subclass objects under one declared type.\n- Overridden `toString()` makes debugging and printing painless.\n\nPolymorphism plus overriding plus the Object methods together make Java's object model flexible and extensible.",
      "key_terms": [
        {
          "term": "polymorphism",
          "definition": "The ability of a superclass reference to refer to subclass objects so the correct overridden method runs at run time."
        },
        {
          "term": "dynamic dispatch",
          "definition": "Java's run-time selection of the overridden method based on the object's actual type, not the variable's declared type."
        },
        {
          "term": "toString()",
          "definition": "An Object method that returns a String description of an object; overriding it gives readable output for printing."
        }
      ],
      "inline_quizzes": [
        {
          "question": "A variable declared as Shape points to a Square object. Which area() runs when you call it?",
          "options": [
            "Shape's area()",
            "Square's area()",
            "Neither; it is an error",
            "Object's area()"
          ],
          "correct_index": 1,
          "explanation": "Dynamic dispatch selects the method based on the object's actual type, so Square's overridden area() runs."
        }
      ],
      "quiz_questions": [
        {
          "question": "Why is toString() usually overridden in a class?",
          "options": [
            "To make the class compile",
            "Because the default returns an unhelpful hash-based string instead of readable data",
            "To enable inheritance",
            "Because Object has no toString()"
          ],
          "correct_index": 1,
          "explanation": "Object's default toString() returns something like Square@1b6d. Overriding it gives a readable description used by println and concatenation."
        },
        {
          "question": "What does the default Object equals() method compare?",
          "options": [
            "The values of all fields",
            "Whether the two references point to the same object",
            "The class names only",
            "The toString() outputs"
          ],
          "correct_index": 1,
          "explanation": "The default equals() compares references (like ==). To compare field values you must override equals()."
        }
      ],
      "challenge_title": "Polymorphic Shape Areas",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\nclass Shape {\n    public double area() { return 0.0; }\n}\n\nclass Square extends Shape {\n    private double side;\n    public Square(double side) { this.side = side; }\n    @Override\n    public double area() { return side * side; }\n}\n\nclass Rect extends Shape {\n    private double w, h;\n    public Rect(double w, double h) { this.w = w; this.h = h; }\n    // TODO: override area() to return w * h\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        double s = sc.nextDouble();\n        double w = sc.nextDouble();\n        double h = sc.nextDouble();\n        Shape[] shapes = { new Square(s), new Rect(w, h) };\n        // TODO: print the area of each shape on its own line using a loop\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\nclass Shape {\n    public double area() { return 0.0; }\n}\n\nclass Square extends Shape {\n    private double side;\n    public Square(double side) { this.side = side; }\n    @Override\n    public double area() { return side * side; }\n}\n\nclass Rect extends Shape {\n    private double w, h;\n    public Rect(double w, double h) { this.w = w; this.h = h; }\n    @Override\n    public double area() { return w * h; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        double s = sc.nextDouble();\n        double w = sc.nextDouble();\n        double h = sc.nextDouble();\n        Shape[] shapes = { new Square(s), new Rect(w, h) };\n        for (Shape shape : shapes) {\n            System.out.println(shape.area());\n        }\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "3\n4\n5",
          "expected_output": "9.0\n20.0"
        },
        {
          "input": "2\n2\n2",
          "expected_output": "4.0\n4.0"
        },
        {
          "input": "1.5\n2\n3",
          "expected_output": "2.25\n6.0"
        }
      ]
    }
  ]
}
