import type { Text } from "./missions";

export type Lesson = {
  slug: string;
  title: Text;
  summary: Text;
  body: Text[];
  rule: Text;
};

const catalog: Lesson[] = [
  {
    slug: "electricity",
    title: {
      en: "Voltage, current, resistance",
      kk: "Кернеу, ток, кедергі",
      ru: "Напряжение, ток, сопротивление",
    },
    summary: {
      en: "Three quantities that explain almost every fault.",
      kk: "Ақаулардың барлығын дерлік түсіндіретін үш шама.",
      ru: "Три величины, которые объясняют почти любую поломку.",
    },
    body: [
      {
        en: "Voltage (volts, V) is the push that moves electric charge. Current (amperes, A) is how much charge actually flows. Resistance (ohms, Ω) is how hard a part makes it for the current to pass.",
        kk: "Кернеу (вольт, В) — электр зарядын итеретін «қысым». Ток (ампер, А) — нақты қанша заряд ағып жатқаны. Кедергі (ом, Ом) — бөлшектің токтың өтуіне қаншалықты кедергі жасайтыны.",
        ru: "Напряжение (вольты, В) — это «давление», которое толкает электрический заряд. Ток (амперы, А) — сколько заряда реально течёт. Сопротивление (омы, Ом) — насколько деталь мешает току проходить.",
      },
      {
        en: "A common picture is water in a pipe: voltage is the pressure, current is the flow, resistance is how narrow the pipe is. More pressure gives more flow; a narrower pipe gives less.",
        kk: "Мұны құбырдағы су деп елестетуге болады: кернеу — қысым, ток — су ағыны, кедергі — құбырдың тарлығы. Қысым көп болса, ағын көп; құбыр тар болса, ағын аз.",
        ru: "Удобно представлять воду в трубе: напряжение — это давление, ток — поток воды, сопротивление — узость трубы. Больше давление — больше поток; уже труба — меньше поток.",
      },
      {
        en: "Ohm's law ties them together: current = voltage ÷ resistance. With 3 V across a 220 Ω resistor the current is 3 ÷ 220 ≈ 0.014 A, or 14 mA. In electronics you will mostly meet milliamps (mA, thousandths of an amp) and kilohms (kΩ, thousands of ohms).",
        kk: "Ом заңы оларды байланыстырады: ток = кернеу ÷ кедергі. 220 Ом резисторда 3 В түссе, ток 3 ÷ 220 ≈ 0,014 А, яғни 14 мА болады. Электроникада көбіне миллиампер (мА, ампердің мыңнан бір бөлігі) мен килоом (кОм, мың ом) кездеседі.",
        ru: "Закон Ома связывает их: ток = напряжение ÷ сопротивление. Если на резисторе 220 Ом падает 3 В, ток равен 3 ÷ 220 ≈ 0,014 А, то есть 14 мА. В электронике чаще всего встречаются миллиамперы (мА, тысячные доли ампера) и килоомы (кОм, тысячи ом).",
      },
    ],
    rule: {
      en: "If something is too dim, too weak or too hot, ask: what is the voltage, what is the resistance, and so what is the current?",
      kk: "Бір нәрсе тым күңгірт жанса, әлсіз істесе немесе қызса, өзіңе сұрақ қой: мұнда кернеу қандай, кедергі қандай, сонда ток қанша?",
      ru: "Если что-то светит слишком тускло, работает слишком слабо или греется, спроси себя: какое здесь напряжение, какое сопротивление и какой получается ток?",
    },
  },
  {
    slug: "circuit",
    title: {
      en: "Closed circuit and ground",
      kk: "Тұйық тізбек және жер",
      ru: "Замкнутая цепь и земля",
    },
    summary: {
      en: "Current needs a full loop, and every part needs the same zero.",
      kk: "Токқа тұйық жол керек, ал барлық бөлшекке — ортақ нөл.",
      ru: "Току нужен замкнутый путь, а всем деталям — общий ноль.",
    },
    body: [
      {
        en: "Current flows only in a closed loop: out of the power source, through the parts, and back to the source. Break the loop anywhere and nothing works, even if every part is fine.",
        kk: "Ток тек тұйық тізбекте ғана ағады: қорек көзінен шығып, бөлшектер арқылы өтіп, қайтадан көзге оралады. Тізбек кез келген жерінен үзілсе, бөлшектердің бәрі дұрыс болса да ештеңе істемейді.",
        ru: "Ток течёт только по замкнутому контуру: из источника питания, через детали и обратно в источник. Если разорвать контур в любом месте, ничего не заработает, даже когда все детали исправны.",
      },
      {
        en: "GND (ground) is the return path and the zero level that all voltages are measured from. \"5 V on a pin\" really means 5 V higher than GND.",
        kk: "GND (жер) — токтың қайтатын жолы және барлық кернеу өлшенетін нөлдік деңгей. «Пинде 5 В» дегеніміз шын мәнінде «GND-дан 5 В жоғары» дегенді білдіреді.",
        ru: "GND (земля) — это обратный путь и нулевой уровень, от которого отсчитываются все напряжения. «5 В на пине» на самом деле означает «на 5 В выше, чем GND».",
      },
      {
        en: "When a project has two power sources, for example USB for the Arduino and a battery for a motor, their minus sides must be joined. Without this common ground the parts cannot understand each other's signals.",
        kk: "Жобада екі қорек көзі болса, мысалы, Arduino үшін USB және мотор үшін батарея, олардың минустарын өзара қосу керек. Мұндай ортақ жер болмаса, бөлшектер бір-бірінің сигналын түсінбейді.",
        ru: "Если в проекте два источника питания, например USB для Arduino и батарея для мотора, их минусы нужно соединить. Без такой общей земли детали не понимают сигналы друг друга.",
      },
    ],
    rule: {
      en: "For every part, trace the path with your finger: where does the current come from, and how does it get back to GND?",
      kk: "Әр бөлшек үшін жолды саусақпен жүргізіп шық: ток қайдан келеді және GND-ға қалай қайтады?",
      ru: "Для каждой детали проведи путь пальцем: откуда приходит ток и как он возвращается к GND?",
    },
  },
  {
    slug: "led-resistor",
    title: {
      en: "LED and resistor",
      kk: "Жарықдиод және резистор",
      ru: "Светодиод и резистор",
    },
    summary: {
      en: "Why an LED has a direction and never works alone.",
      kk: "Жарықдиодтың неге бағыты бар және неге жалғыз жұмыс істемейді.",
      ru: "Почему у светодиода есть направление и почему он не работает один.",
    },
    body: [
      {
        en: "An LED (light-emitting diode) passes current in one direction only. The long leg is the anode (+) and goes toward the higher voltage; the short leg is the cathode (−) and goes toward GND. Plugged in backwards, it simply stays dark.",
        kk: "Жарықдиод (LED) токты тек бір бағытта өткізеді. Ұзын аяғы — анод (+), ол жоғары кернеу жағына қосылады; қысқа аяғы — катод (−), ол GND жағына қосылады. Теріс қосылса, ол жай жанбайды.",
        ru: "Светодиод (LED) пропускает ток только в одну сторону. Длинная ножка — анод (+), она идёт к большему напряжению; короткая — катод (−), она идёт к GND. Если вставить светодиод наоборот, он просто не загорится.",
      },
      {
        en: "An LED does not limit its own current. Connected straight to 5 V it would take far too much and burn out, so it always gets a resistor in series.",
        kk: "Жарықдиод өз тогын өзі шектемейді. Тікелей 5 В-қа қосылса, тым көп ток алып, күйіп кетеді, сондықтан оған әрқашан тізбектей резистор қосылады.",
        ru: "Светодиод сам не ограничивает свой ток. Подключённый прямо к 5 В, он возьмёт слишком много и сгорит, поэтому последовательно с ним всегда ставят резистор.",
      },
      {
        en: "To choose the resistor, subtract the LED's own voltage (about 2 V for red) from the supply and apply Ohm's law: (5 − 2) ÷ 0.015 A = 200 Ω. The nearest common value, 220 Ω, is the usual choice. A much larger resistor makes the LED very dim.",
        kk: "Резисторды таңдау үшін қорек кернеуінен жарықдиодтың өз кернеуін (қызыл үшін шамамен 2 В) азайтып, Ом заңын қолдан: (5 − 2) ÷ 0,015 А = 200 Ом. Әдетте ең жақын стандартты мән — 220 Ом алынады. Резистор әлдеқайда үлкен болса, жарықдиод әрең жанады.",
        ru: "Чтобы подобрать резистор, вычти из напряжения питания напряжение самого светодиода (около 2 В у красного) и примени закон Ома: (5 − 2) ÷ 0,015 А = 200 Ом. Обычно берут ближайший стандартный номинал — 220 Ом. С намного большим резистором светодиод будет еле светиться.",
      },
    ],
    rule: {
      en: "LED dark: check its direction. LED dim: check the resistor value and the pin mode.",
      kk: "Жарықдиод жанбаса — бағытын тексер. Күңгірт жанса — резистор мәнін және пин режимін тексер.",
      ru: "Светодиод не горит — проверь направление. Горит тускло — проверь номинал резистора и режим пина.",
    },
  },
  {
    slug: "digital-pins",
    title: {
      en: "Digital pins: output and input",
      kk: "Сандық пиндер: шығыс және кіріс",
      ru: "Цифровые пины: выход и вход",
    },
    summary: {
      en: "HIGH, LOW, pinMode, and why an input must never float.",
      kk: "HIGH, LOW, pinMode және кірісті неге «ілініп» қалдыруға болмайды.",
      ru: "HIGH, LOW, pinMode и почему вход нельзя оставлять «в воздухе».",
    },
    body: [
      {
        en: "A digital pin knows two states: HIGH (5 V) and LOW (0 V). Before using a pin, tell the board its role with pinMode(): OUTPUT to control something, INPUT to read something. Every pin starts as an input.",
        kk: "Сандық пин екі күйді біледі: HIGH (5 В) және LOW (0 В). Пинді қолданбас бұрын оның рөлін pinMode() арқылы көрсету керек: бір нәрсені басқару үшін OUTPUT, бір нәрсені оқу үшін INPUT. Бастапқыда әр пин кіріс ретінде тұрады.",
        ru: "Цифровой пин знает два состояния: HIGH (5 В) и LOW (0 В). Перед использованием пину нужно задать роль через pinMode(): OUTPUT — чтобы чем-то управлять, INPUT — чтобы что-то читать. Изначально каждый пин работает как вход.",
      },
      {
        en: "As an output, the pin is set with digitalWrite(). If you forget pinMode(pin, OUTPUT), writing HIGH only turns on a weak internal resistor, and an LED on that pin barely glows.",
        kk: "Шығыс digitalWrite() арқылы басқарылады. pinMode(pin, OUTPUT) жазуды ұмытсаң, HIGH жазу тек әлсіз ішкі резисторды қосады да, сол пиндегі жарықдиод әрең жанады.",
        ru: "Выходом управляют через digitalWrite(). Если забыть pinMode(pin, OUTPUT), запись HIGH включит лишь слабый внутренний резистор, и светодиод на этом пине будет еле светиться.",
      },
      {
        en: "As an input, the pin is read with digitalRead(). An input connected to nothing is floating and returns random values. A pull-down resistor (to GND) or a pull-up resistor (to 5 V) holds it at a known level; INPUT_PULLUP switches on a pull-up that is built into the board.",
        kk: "Кіріс digitalRead() арқылы оқылады. Ештеңеге қосылмаған кіріс «ілініп тұрады» және кездейсоқ мән береді. GND-ға қосылған (pull-down) немесе 5 В-қа қосылған (pull-up) резистор оны белгілі деңгейде ұстайды; INPUT_PULLUP режимі платаға кіріктірілген pull-up резисторын қосады.",
        ru: "Вход читают через digitalRead(). Вход, который ни к чему не подключён, «висит в воздухе» и выдаёт случайные значения. Резистор к GND (pull-down) или к 5 В (pull-up) удерживает на нём известный уровень; режим INPUT_PULLUP включает подтяжку, встроенную в плату.",
      },
    ],
    rule: {
      en: "Every pin you use needs a pinMode, and every input needs something that holds its level when the button is released.",
      kk: "Қолданылатын әр пинге pinMode керек, ал әр кіріске батырма жіберулі кезде деңгейін ұстап тұратын нәрсе керек.",
      ru: "Каждому используемому пину нужен pinMode, а каждому входу — то, что удерживает его уровень, когда кнопка отпущена.",
    },
  },
  {
    slug: "analog-pwm",
    title: {
      en: "Analog input and PWM",
      kk: "Аналогтық кіріс және ШИМ",
      ru: "Аналоговый вход и ШИМ",
    },
    summary: {
      en: "Reading a range of values, and imitating one on the output.",
      kk: "Мәндер ауқымын қалай оқуға және шығыста қалай бейнелеуге болады.",
      ru: "Как читать диапазон значений и как изобразить его на выходе.",
    },
    body: [
      {
        en: "Pins A0–A5 can measure a voltage between 0 and 5 V. analogRead() returns it as a number from 0 to 1023. A potentiometer is the simplest source: outer legs to 5V and GND, middle leg to the analog pin.",
        kk: "A0–A5 пиндері 0 мен 5 В арасындағы кернеуді өлшей алады. analogRead() оны 0-ден 1023-ке дейінгі сан түрінде қайтарады. Ең қарапайым көз — потенциометр: шеткі аяқтары 5V мен GND-ға, ортаңғысы аналогтық пинге қосылады.",
        ru: "Пины A0–A5 умеют измерять напряжение от 0 до 5 В. analogRead() возвращает его числом от 0 до 1023. Самый простой источник — потенциометр: крайние ножки к 5V и GND, средняя к аналоговому пину.",
      },
      {
        en: "The Uno cannot output a real in-between voltage. Instead analogWrite() switches a pin on and off very quickly and changes how long it stays on. This is PWM, and to an LED or a motor it looks like less power. Only the pins marked ~ (3, 5, 6, 9, 10, 11) can do it.",
        kk: "Uno нақты аралық кернеу шығара алмайды. Оның орнына analogWrite() пинді өте жылдам қосып-өшіріп, қосулы тұратын уақыт үлесін өзгертеді. Бұл ШИМ (PWM) деп аталады; жарықдиод немесе мотор үшін бұл азырақ қуат сияқты көрінеді. Мұны тек ~ белгісі бар пиндер (3, 5, 6, 9, 10, 11) істей алады.",
        ru: "Настоящее промежуточное напряжение Uno выдать не может. Вместо этого analogWrite() очень быстро включает и выключает пин и меняет долю времени, когда он включён. Это ШИМ (PWM); для светодиода или мотора это выглядит как меньшая мощность. ШИМ умеют только пины со значком ~ (3, 5, 6, 9, 10, 11).",
      },
      {
        en: "The two ranges do not match: analogRead() gives 0–1023, analogWrite() takes 0–255. Divide by 4 or use map() when passing a reading to an output.",
        kk: "Екі ауқым сәйкес келмейді: analogRead() 0–1023 береді, ал analogWrite() 0–255 қабылдайды. Оқылған мәнді шығысқа бергенде оны 4-ке бөл немесе map() қолдан.",
        ru: "Диапазоны не совпадают: analogRead() даёт 0–1023, а analogWrite() принимает 0–255. Передавая показание на выход, раздели его на 4 или используй map().",
      },
    ],
    rule: {
      en: "Check three things: is it a ~ pin, is the value in 0–255, and does the sensor have both 5V and GND?",
      kk: "Үш нәрсені тексер: пинде ~ белгісі бар ма, мән 0–255 аралығында ма, датчикте 5V да, GND да бар ма?",
      ru: "Проверь три вещи: это пин со значком ~, значение лежит в пределах 0–255, у датчика есть и 5V, и GND?",
    },
  },
  {
    slug: "serial",
    title: {
      en: "Serial Monitor: your eyes inside the board",
      kk: "Serial Monitor: плата ішіндегі көзің",
      ru: "Serial Monitor: глаза внутри платы",
    },
    summary: {
      en: "The board has no screen, so make it tell you what it sees.",
      kk: "Платада экран жоқ, сондықтан оның не көріп тұрғанын өзіне айтқыз.",
      ru: "У платы нет экрана, поэтому заставь её рассказывать, что она видит.",
    },
    body: [
      {
        en: "Serial sends text from the Arduino to your computer over the USB cable. Start it once with Serial.begin(9600), then print values with Serial.println(). The Serial Monitor in the Arduino IDE shows them.",
        kk: "Serial мәтінді Arduino-дан компьютерге USB кабелі арқылы жібереді. Оны бір рет Serial.begin(9600) арқылы іске қос, сосын мәндерді Serial.println() арқылы шығар. Оларды Arduino IDE-дегі Serial Monitor көрсетеді.",
        ru: "Serial передаёт текст с Arduino на компьютер по USB-кабелю. Один раз запусти его через Serial.begin(9600), а затем выводи значения через Serial.println(). Их показывает Serial Monitor в Arduino IDE.",
      },
      {
        en: "The number in Serial.begin() is the speed in baud. The monitor must be set to the same speed, otherwise you see random symbols instead of text.",
        kk: "Serial.begin() ішіндегі сан — бодпен берілген жылдамдық. Мониторда да дәл сол жылдамдық таңдалуы керек, әйтпесе мәтіннің орнына кездейсоқ таңбалар шығады.",
        ru: "Число в Serial.begin() — это скорость в бодах. В мониторе должна быть выбрана та же скорость, иначе вместо текста будут случайные символы.",
      },
      {
        en: "Printing is the main debugging tool. Not sure whether a sensor works? Print its reading. Not sure whether the code reaches a line? Print a word there. A value that never changes, or is always 0, tells you where to look.",
        kk: "Мәнді экранға шығару — ақау іздеудің басты құралы. Датчик жұмыс істеп тұрғанына сенімді емессің бе? Оның көрсеткішін шығар. Код керекті жолға жететініне сенімді емессің бе? Сол жерде бір сөз шығар. Өзгермейтін немесе үнемі 0 болатын мән қай жерден іздеу керегін көрсетеді.",
        ru: "Вывод на печать — главный инструмент отладки. Не уверен, работает ли датчик? Выведи его показание. Не уверен, доходит ли код до нужной строки? Выведи там слово. Значение, которое не меняется или всегда равно 0, подсказывает, где искать.",
      },
    ],
    rule: {
      en: "When you cannot see what is happening, print it.",
      kk: "Не болып жатқаны көрінбесе — оны экранға шығар.",
      ru: "Если не видно, что происходит, — выведи это на печать.",
    },
  },
  {
    slug: "special-pins",
    title: {
      en: "Pins with a second job",
      kk: "Қосымша міндеті бар пиндер",
      ru: "Пины с двойной ролью",
    },
    summary: {
      en: "Not all pins are equal: some are already busy.",
      kk: "Пиндердің бәрі бірдей емес: кейбірі онсыз да бос емес.",
      ru: "Не все пины одинаковы: некоторые уже заняты.",
    },
    body: [
      {
        en: "Pins 0 (RX) and 1 (TX) are the serial port. The computer uses them to upload sketches and for the Serial Monitor. Keep them free; put modules that speak serial, such as Bluetooth, on other pins with SoftwareSerial.",
        kk: "0 (RX) және 1 (TX) пиндері — тізбекті порт. Компьютер оларды скетч жүктеу және Serial Monitor үшін қолданады. Оларды бос қалдыр; Bluetooth сияқты тізбекті порт арқылы сөйлесетін модульдерді SoftwareSerial көмегімен басқа пиндерге қос.",
        ru: "Пины 0 (RX) и 1 (TX) — последовательный порт. Компьютер использует их для загрузки скетчей и для Serial Monitor. Оставляй их свободными; модули, которые общаются по последовательному порту, например Bluetooth, подключай к другим пинам через SoftwareSerial.",
      },
      {
        en: "A4 and A5 double as the I2C bus: A4 is SDA (data) and A5 is SCL (clock). Displays and many sensors connect here, and several devices can share the same two wires. Swap SDA and SCL and nothing answers.",
        kk: "A4 пен A5 қосымша I2C шинасы қызметін атқарады: A4 — SDA (деректер), A5 — SCL (тактілік сигнал). Дисплейлер мен көптеген датчиктер осында қосылады, әрі бірнеше құрылғы сол екі сымды бөлісе алады. SDA мен SCL орнын ауыстырып алсаң, ешқайсысы жауап бермейді.",
        ru: "A4 и A5 по совместительству работают шиной I2C: A4 — это SDA (данные), A5 — SCL (тактовый сигнал). Сюда подключают дисплеи и многие датчики, причём несколько устройств могут делить одни и те же два провода. Если перепутать SDA и SCL, не ответит никто.",
      },
      {
        en: "The pins marked ~ (3, 5, 6, 9, 10, 11) are the only ones with PWM. Pin 13 has a small LED on the board attached to it, which is handy for a first test. Before wiring anything, look at the board's pinout diagram and check what else each pin does.",
        kk: "~ белгісі бар пиндерде (3, 5, 6, 9, 10, 11) ғана ШИМ бар. 13-пинге платадағы кішкентай жарықдиод қосылған — бұл алғашқы тексеруге ыңғайлы. Бір нәрсені қоспас бұрын платаның пиндер сызбасына (pinout) қарап, әр пиннің тағы не істейтінін тексер.",
        ru: "ШИМ есть только у пинов со значком ~ (3, 5, 6, 9, 10, 11). К пину 13 подключён маленький светодиод на самой плате — он удобен для первой проверки. Прежде чем что-то подключать, посмотри на схему выводов платы (pinout) и проверь, чем ещё занят каждый пин.",
      },
    ],
    rule: {
      en: "Before you pick a pin, check what else it is used for.",
      kk: "Пин таңдамас бұрын оның тағы не үшін қолданылатынын тексер.",
      ru: "Прежде чем выбрать пин, проверь, для чего ещё он используется.",
    },
  },
  {
    slug: "power",
    title: {
      en: "Powering motors and servos",
      kk: "Моторлар мен сервоны қоректендіру",
      ru: "Питание моторов и сервоприводов",
    },
    summary: {
      en: "A pin is a signal, not a power supply.",
      kk: "Пин — қорек көзі емес, сигнал.",
      ru: "Пин — это сигнал, а не источник питания.",
    },
    body: [
      {
        en: "An Arduino pin can safely give about 20 mA. That is enough for an LED, but a motor or a servo needs hundreds of milliamps. Connected straight to a pin, a motor will not spin and the pin can be damaged.",
        kk: "Arduino пині қауіпсіз түрде шамамен 20 мА бере алады. Жарықдиодқа бұл жеткілікті, бірақ моторға немесе сервоға жүздеген миллиампер керек. Тікелей пинге қосылған мотор айналмайды, ал пин зақымдануы мүмкін.",
        ru: "Пин Arduino безопасно отдаёт около 20 мА. Для светодиода этого хватает, но мотору или серво нужны сотни миллиампер. Мотор, подключённый прямо к пину, не закрутится, а пин может выйти из строя.",
      },
      {
        en: "The 5V pin is stronger, but when the board runs from USB it has roughly 0.5 A for everything. A large servo pulls more than that when it starts moving, the voltage dips, and the board restarts.",
        kk: "5V пині күштірек, бірақ плата USB-ден қоректенгенде барлығына шамамен 0,5 А ғана бар. Үлкен серво қозғала бастағанда одан көп тартады, кернеу түсіп кетеді де, плата қайта іске қосылады.",
        ru: "Пин 5V мощнее, но при питании платы от USB на всё вместе есть примерно 0,5 А. Большой серво в начале движения берёт больше, напряжение проседает, и плата перезагружается.",
      },
      {
        en: "The fix is always the same: give the motor its own power source, switch it with a transistor or a driver board, let the Arduino pin send only the signal, and join the grounds.",
        kk: "Шешімі әрқашан бір: моторға бөлек қорек көзін бер, оны транзистор немесе драйвер платасы арқылы қос, Arduino пинінен тек сигнал жібер және жерлерді біріктір.",
        ru: "Решение всегда одно: дай мотору отдельный источник питания, включай его через транзистор или плату-драйвер, с пина Arduino подавай только сигнал и соедини земли.",
      },
    ],
    rule: {
      en: "If the board restarts or a motor only twitches, suspect the power before the code.",
      kk: "Плата қайта іске қосылса немесе мотор тек дірілдесе, кодтан бұрын қоректен күдіктен.",
      ru: "Если плата перезагружается или мотор только дёргается, сначала подозревай питание, а не код.",
    },
  },
  {
    slug: "timing",
    title: {
      en: "Time without delay()",
      kk: "delay()-сіз уақыт",
      ru: "Время без delay()",
    },
    summary: {
      en: "How to wait and still pay attention.",
      kk: "Күте тұрып, назарды жоғалтпау жолы.",
      ru: "Как ждать и при этом ничего не пропускать.",
    },
    body: [
      {
        en: "delay(1000) is the simplest way to wait, but for that whole second the program does nothing else: it reads no buttons, no sensors, and prints nothing. In a project with one LED that is fine. In a robot it means a second of blindness.",
        kk: "delay(1000) — күтудің ең қарапайым тәсілі, бірақ сол бір секунд бойы бағдарлама басқа ештеңе істемейді: батырманы да, датчикті де оқымайды, ештеңе шығармайды. Бір жарықдиоды бар жобада бұл қалыпты. Ал роботта бұл — бір секунд соқыр болу.",
        ru: "delay(1000) — самый простой способ подождать, но всю эту секунду программа больше ничего не делает: не читает кнопки и датчики, ничего не печатает. В проекте с одним светодиодом это нормально. В роботе это секунда слепоты.",
      },
      {
        en: "The alternative is to look at the clock. millis() says how many milliseconds have passed since the board started. Remember the moment you last did something; on every pass of loop() compare: if millis() - last >= 1000, do it again and update last. Between checks the loop is free for everything else.",
        kk: "Балама жол — сағатқа қарау. millis() плата іске қосылғаннан бері қанша миллисекунд өткенін айтады. Бір нәрсені соңғы рет қашан істегеніңді есте сақта; loop()-тың әр айналымында салыстыр: millis() - last >= 1000 болса, оны қайта істеп, last мәнін жаңарт. Тексерулер арасында цикл басқа жұмыстарға бос.",
        ru: "Альтернатива — смотреть на часы. millis() сообщает, сколько миллисекунд прошло с запуска платы. Запомни момент, когда ты в последний раз что-то сделал; на каждом проходе loop() сравнивай: если millis() - last >= 1000, сделай это снова и обнови last. Между проверками цикл свободен для всего остального.",
      },
      {
        en: "Time values are large, so store them in unsigned long, the same type millis() returns. An int on the Uno overflows after about 32 seconds and the timing silently breaks.",
        kk: "Уақыт мәндері үлкен, сондықтан оларды millis() қайтаратын түрде — unsigned long түрінде сақта. Uno-дағы int шамамен 32 секундтан кейін толып кетеді де, уақыт есебі білдірмей бұзылады.",
        ru: "Значения времени большие, поэтому храни их в unsigned long — том же типе, который возвращает millis(). Тип int на Uno переполняется примерно через 32 секунды, и отсчёт времени незаметно ломается.",
      },
    ],
    rule: {
      en: "If the project misses presses or reacts late, look for a long delay(). If it breaks after running for a while, look at the variable types.",
      kk: "Жоба басуларды өткізіп алса немесе кеш жауап берсе, ұзақ delay() ізде. Біраз жұмыс істегеннен кейін бұзылса, айнымалылардың түріне қара.",
      ru: "Если проект пропускает нажатия или реагирует с опозданием, ищи длинный delay(). Если ломается после некоторого времени работы, смотри на типы переменных.",
    },
  },
  {
    slug: "debugging",
    title: {
      en: "How to find a fault",
      kk: "Ақауды қалай табуға болады",
      ru: "Как искать неисправность",
    },
    summary: {
      en: "A method that works on any broken project.",
      kk: "Кез келген бұзылған жобада жұмыс істейтін әдіс.",
      ru: "Метод, который работает на любом сломанном проекте.",
    },
    body: [
      {
        en: "First describe the symptom exactly. \"It doesn't work\" is not a symptom. \"The LED glows faintly\" or \"the monitor prints 0 once a second\" is one, and each points to different causes.",
        kk: "Алдымен белгіні дәл сипатта. «Жұмыс істемейді» — белгі емес. «Жарықдиод әрең жанады» немесе «монитор секундына бір рет 0 шығарады» — бұл белгілер, және әрқайсысы әртүрлі себепке нұсқайды.",
        ru: "Сначала точно опиши симптом. «Не работает» — это не симптом. «Светодиод еле светится» или «монитор раз в секунду печатает 0» — симптомы, и каждый указывает на свои причины.",
      },
      {
        en: "Then compare three things with each other: what the project should do, what the wiring really is, and what the code really says. Check every wire against the pin numbers in the code. Most faults are a mismatch between two of these.",
        kk: "Содан кейін үш нәрсені өзара салыстыр: жоба не істеуі керек, сызба шын мәнінде қалай жиналған және кодта шын мәнінде не жазылған. Әр сымды кодтағы пин нөмірлерімен салыстыр. Ақаулардың көбі — осы үшеуінің екеуінің сәйкес келмеуі.",
        ru: "Затем сравни между собой три вещи: что проект должен делать, как на самом деле собрана схема и что на самом деле написано в коде. Сверь каждый провод с номерами пинов в коде. Большинство поломок — это несовпадение двух из этих трёх.",
      },
      {
        en: "Change one thing at a time and test again. If you change three things and it starts working, you will not know which one was the fault, and you will not learn anything for next time.",
        kk: "Бір уақытта тек бір нәрсені өзгертіп, қайта тексер. Үш нәрсені бірден өзгертіп, бәрі істеп кетсе, ақау қайсысында болғанын білмейсің және келесі жолға ештеңе үйренбейсің.",
        ru: "Меняй что-то одно за раз и проверяй снова. Если поменять три вещи сразу и всё заработает, ты не узнаешь, в чём была поломка, и ничему не научишься на будущее.",
      },
    ],
    rule: {
      en: "Symptom first, then wiring against code, then one change at a time.",
      kk: "Алдымен белгі, сосын сызба мен кодты салыстыру, сосын бір-бірден өзгерту.",
      ru: "Сначала симптом, затем схема против кода, затем по одному изменению за раз.",
    },
  },
  {
    slug: "reading-diagrams",
    title: {
      en: "How to read the diagrams",
      kk: "Сызбаларды қалай оқуға болады",
      ru: "Как читать схемы",
    },
    summary: {
      en: "Everything in a mission is drawn. Here is what the drawing means.",
      kk: "Миссиядағы нәрсенің бәрі сызбада көрсетілген. Сызбаның нені білдіретіні осында.",
      ru: "Всё, что есть в миссии, нарисовано. Вот что этот рисунок означает.",
    },
    body: [
      {
        en: "Each line is a wire. A wire only carries current from one end to the other; its length and its bends mean nothing. Each dot is a contact. A filled dot has a wire on it. A hollow dot is a contact that nothing is connected to, and it is often the clue.",
        kk: "Әр сызық — сым. Сым токты бір ұшынан екінші ұшына ғана жеткізеді; оның ұзындығы мен иілістерінің мәні жоқ. Әр нүкте — контакт. Боялған нүктеге сым қосылған. Іші бос нүкте — ештеңе қосылмаған контакт, және көбіне жауаптың кілті сонда.",
        ru: "Каждая линия — это провод. Провод только переносит ток с одного конца на другой; его длина и изгибы ничего не значат. Каждая точка — это контакт. К закрашенной точке подключён провод. Пустая точка — контакт, к которому ничего не подключено, и часто подсказка именно в ней.",
      },
      {
        en: "The red line along the top is the plus side: 5V on an Arduino, or the plus of a battery. The grey line along the bottom is the minus side, GND. Parts that hang between these two lines are powered. Coloured lines coming out of the board are signal wires, one colour per wire.",
        kk: "Жоғарыдағы қызыл сызық — плюс жағы: Arduino-да 5V немесе батареяның плюсі. Төмендегі сұр сызық — минус жағы, GND. Осы екі сызықтың арасына қосылған бөлшектер қорек алады. Платадан шығатын түрлі түсті сызықтар — сигнал сымдары, әр сымға бір түс.",
        ru: "Красная линия вверху — это плюс: 5V на Arduino или плюс батарейки. Серая линия внизу — это минус, GND. Детали, которые включены между этими двумя линиями, получают питание. Цветные линии, выходящие из платы, — сигнальные провода, по одному цвету на провод.",
      },
      {
        en: "The board shows only the pins the project uses. A ~ in front of a number marks a pin that can do PWM. On an LED the labels \"long +\" and \"short −\" show which leg is where. Always compare the drawing with the list of connections and with the pin numbers in the code: the three must agree.",
        kk: "Платада тек жобада қолданылатын пиндер көрсетіледі. Сан алдындағы ~ белгісі ШИМ жасай алатын пинді білдіреді. Жарықдиодтағы «ұзын +» және «қысқа −» жазулары қай аяғы қайда тұрғанын көрсетеді. Сызбаны әрдайым қосылыстар тізімімен және кодтағы пин нөмірлерімен салыстыр: үшеуі бір-біріне сәйкес келуі керек.",
        ru: "На плате показаны только те пины, которые используются в проекте. Значок ~ перед номером отмечает пин с ШИМ. У светодиода подписи «длин. +» и «корот. −» показывают, где какая ножка. Всегда сравнивай рисунок со списком соединений и с номерами пинов в коде: все три должны совпадать.",
      },
    ],
    rule: {
      en: "Follow every wire from end to end, and look twice at every hollow dot.",
      kk: "Әр сымды басынан аяғына дейін қадағала, ал әр бос нүктеге екі рет қара.",
      ru: "Проследи каждый провод от начала до конца и дважды посмотри на каждую пустую точку.",
    },
  },
  {
    slug: "what-is-arduino",
    title: { en: "What is an Arduino", kk: "Arduino деген не", ru: "Что такое Arduino" },
    summary: {
      en: "A small computer that switches things on and off.",
      kk: "Заттарды қосып-өшіретін кішкентай компьютер.",
      ru: "Маленький компьютер, который включает и выключает вещи.",
    },
    body: [
      {
        en: "An Arduino Uno is a board with a tiny computer on it, called a microcontroller. It has no screen and no keyboard. Instead it has pins: metal contacts along its edges that wires plug into. Through the pins it switches things on and off and reads buttons and sensors.",
        kk: "Arduino Uno — үстінде микроконтроллер деп аталатын кішкентай компьютері бар плата. Оның экраны да, пернетақтасы да жоқ. Оның орнына пиндері бар: шеттеріндегі сым қосылатын металл контактілер. Пиндер арқылы ол заттарды қосып-өшіреді және батырмалар мен датчиктерді оқиды.",
        ru: "Arduino Uno — это плата с крошечным компьютером, который называют микроконтроллером. У неё нет экрана и клавиатуры. Вместо этого у неё есть пины: металлические контакты по краям, в которые вставляют провода. Через пины она включает и выключает разные вещи и читает кнопки и датчики.",
      },
      {
        en: "The program for the board is called a sketch. You write it on a computer in the Arduino IDE and send it to the board over a USB cable; this is called uploading. After that the board runs the sketch by itself, every time it gets power, even with the computer unplugged.",
        kk: "Платаға арналған бағдарлама скетч деп аталады. Оны компьютерде Arduino IDE-де жазып, USB кабелі арқылы платаға жібересің; бұл жүктеу деп аталады. Одан кейін плата қорек алған сайын скетчті өздігінен орындайды, тіпті компьютер ажыратылған болса да.",
        ru: "Программа для платы называется скетчем. Её пишут на компьютере в Arduino IDE и отправляют на плату по USB-кабелю; это называется загрузкой. После этого плата выполняет скетч сама каждый раз, когда получает питание, даже если компьютер отключён.",
      },
      {
        en: "The pins have numbers and names. Pins 0 to 13 are digital: on or off. Pins A0 to A5 can also measure a voltage. The pin marked 5V is a steady plus, and the pins marked GND are the minus. A pin switched to HIGH behaves like a plus that the sketch controls.",
        kk: "Пиндердің нөмірлері мен атаулары бар. 0-ден 13-ке дейінгі пиндер сандық: қосулы немесе өшірулі. A0–A5 пиндері кернеуді де өлшей алады. 5V деп белгіленген пин — тұрақты плюс, ал GND деп белгіленген пиндер — минус. HIGH күйіне қойылған пин скетч басқаратын плюс сияқты жұмыс істейді.",
        ru: "У пинов есть номера и названия. Пины с 0 по 13 цифровые: включено или выключено. Пины A0–A5 умеют ещё и измерять напряжение. Пин с надписью 5V — постоянный плюс, а пины с надписью GND — минус. Пин, переведённый в HIGH, ведёт себя как плюс, которым управляет скетч.",
      },
    ],
    rule: {
      en: "The number in the sketch and the pin the wire is in must be the same.",
      kk: "Скетчтегі нөмір мен сым қосылған пин бірдей болуы керек.",
      ru: "Номер в скетче и пин, в который вставлен провод, должны совпадать.",
    },
  },
  {
    slug: "sketch-structure",
    title: {
      en: "How a sketch runs",
      kk: "Скетч қалай орындалады",
      ru: "Как выполняется скетч",
    },
    summary: {
      en: "Once in setup(), forever in loop(), one line at a time.",
      kk: "setup() ішінде бір рет, loop() ішінде шексіз, бір-бір жолдан.",
      ru: "Один раз в setup(), бесконечно в loop(), по одной строке.",
    },
    body: [
      {
        en: "Every sketch has two blocks. setup() runs once at the start: this is where you prepare things, for example set pin modes. loop() runs right after and then repeats without end: this is where the real work goes.",
        kk: "Әр скетчте екі блок бар. setup() басында бір рет орындалады: мұнда дайындық жасалады, мысалы пин режимдері қойылады. loop() содан кейін бірден орындалып, шексіз қайталанады: негізгі жұмыс осында жазылады.",
        ru: "В каждом скетче два блока. setup() выполняется один раз в начале: здесь всё готовят, например задают режимы пинов. loop() выполняется сразу после него и затем повторяется без конца: здесь находится основная работа.",
      },
      {
        en: "Inside a block the board runs the lines from top to bottom, one at a time, and very fast. It never waits unless you tell it to with delay(). When it reaches the closing bracket of loop(), it starts again from loop()'s first line.",
        kk: "Блок ішінде плата жолдарды жоғарыдан төмен қарай, бір-бірден және өте жылдам орындайды. delay() арқылы айтпасаң, ол ешқашан күтпейді. loop()-тың жабылатын жақшасына жеткенде, ол loop()-тың бірінші жолынан қайта бастайды.",
        ru: "Внутри блока плата выполняет строки сверху вниз, по одной и очень быстро. Она никогда не ждёт, если ей не сказать об этом через delay(). Дойдя до закрывающей скобки loop(), она начинает снова с первой строки loop().",
      },
      {
        en: "The computer checks the sketch before uploading it. Every command ends with a semicolon, every { needs a }, and names must be spelled exactly, with the same capital letters. An error message usually points at the line after the real mistake.",
        kk: "Компьютер скетчті жүктемес бұрын тексереді. Әр команда нүктелі үтірмен аяқталады, әр { белгісіне } керек, ал атаулар дәл солай, бас әріптерімен бірге жазылуы тиіс. Қате туралы хабар әдетте нағыз қатеден кейінгі жолды көрсетеді.",
        ru: "Перед загрузкой компьютер проверяет скетч. Каждая команда заканчивается точкой с запятой, каждой { нужна своя }, а названия пишутся в точности так, с теми же заглавными буквами. Сообщение об ошибке обычно указывает на строку после настоящей ошибки.",
      },
    ],
    rule: {
      en: "Ask of every line: does it run once or forever, and what happens right after it?",
      kk: "Әр жол туралы сұра: ол бір рет орындала ма, әлде шексіз бе, және одан кейін бірден не болады?",
      ru: "Про каждую строку спроси: она выполняется один раз или бесконечно и что происходит сразу после неё?",
    },
  },
  {
    slug: "breadboard",
    title: { en: "The breadboard", kk: "Макет тақтасы", ru: "Макетная плата" },
    summary: {
      en: "A board full of holes, and the hidden wires under them.",
      kk: "Тесіктерге толы тақта және олардың астындағы жасырын сымдар.",
      ru: "Плата с дырочками и скрытые провода под ними.",
    },
    body: [
      {
        en: "A breadboard lets you build a circuit without soldering: you push the legs of parts and the ends of wires into its holes. Under the holes are metal strips, so some holes are already connected to each other.",
        kk: "Макет тақтасы тізбекті дәнекерлеусіз жинауға мүмкіндік береді: бөлшектердің аяқтары мен сымдардың ұштарын оның тесіктеріне кіргізесің. Тесіктердің астында металл жолақтар бар, сондықтан кейбір тесіктер онсыз да бір-бірімен қосылып тұр.",
        ru: "Макетная плата позволяет собрать схему без пайки: ножки деталей и концы проводов вставляют в её отверстия. Под отверстиями лежат металлические полоски, поэтому некоторые отверстия уже соединены между собой.",
      },
      {
        en: "In the middle area, each short row of five holes is one strip: anything pushed into the same row is connected. The gap down the centre separates the left rows from the right rows. Along the long edges run the power rails, marked + and −; each rail is one long strip, used for 5V and GND.",
        kk: "Ортаңғы бөлікте бес тесіктен тұратын әр қысқа қатар — бір жолақ: бір қатарға кіргізілген нәрсенің бәрі өзара қосылады. Ортадағы саңылау сол жақ қатарларды оң жақ қатарлардан бөледі. Ұзын шеттерінің бойымен + және − деп белгіленген қорек шиналары өтеді; әр шина — 5V мен GND үшін қолданылатын бір ұзын жолақ.",
        ru: "В средней части каждый короткий ряд из пяти отверстий — это одна полоска: всё, что вставлено в один ряд, соединено. Канавка посередине отделяет левые ряды от правых. Вдоль длинных краёв идут шины питания, помеченные + и −; каждая шина — одна длинная полоска, их используют для 5V и GND.",
      },
      {
        en: "Two classic mistakes come from this. If both legs of a part sit in the same row, the part is shorted and does nothing. And if a leg sits one row away from where you meant, it is connected to nothing. Most diagrams in the missions show the connections themselves, not the breadboard, so on a real kit check the rows.",
        kk: "Осыдан екі кең тараған қате шығады. Бөлшектің екі аяғы да бір қатарда тұрса, бөлшек тұйықталып, ештеңе істемейді. Ал аяқ ойлаған жерден бір қатар әрі тұрса, ол ештеңеге қосылмайды. Миссиялардағы сызбалардың көбі макет тақтасын емес, қосылыстардың өзін көрсетеді, сондықтан нағыз жинақта қатарларды тексер.",
        ru: "Отсюда две классические ошибки. Если обе ножки детали стоят в одном ряду, деталь закорочена и ничего не делает. А если ножка стоит на один ряд в стороне от нужного места, она ни к чему не подключена. Большинство схем в миссиях показывают сами соединения, а не макетную плату, поэтому на настоящем наборе проверяй ряды.",
      },
    ],
    rule: {
      en: "Same row means connected. Count the rows before you blame the code.",
      kk: "Бір қатар — қосылған деген сөз. Кодты кінәламас бұрын қатарларды сана.",
      ru: "Один ряд — значит соединено. Прежде чем винить код, пересчитай ряды.",
    },
  },
  {
    slug: "buttons",
    title: { en: "Buttons", kk: "Батырмалар", ru: "Кнопки" },
    summary: {
      en: "The simplest sensor, with three ways to go wrong.",
      kk: "Ең қарапайым датчик және оның қателесетін үш жолы.",
      ru: "Самый простой датчик и три способа ошибиться.",
    },
    body: [
      {
        en: "A button is a gap in a wire that closes while you press it. On its own it gives the pin a level only when pressed. When released, the pin must still be held at the opposite level, by a pull-down resistor to GND or a pull-up resistor to 5V.",
        kk: "Батырма — сымдағы саңылау, ол басып тұрғанда ғана тұйықталады. Жалғыз өзі ол пинге тек басылған кезде ғана деңгей береді. Жіберілген кезде пин бәрібір қарама-қарсы деңгейде ұсталуы керек: GND-ға қосылған pull-down резисторымен немесе 5V-қа қосылған pull-up резисторымен.",
        ru: "Кнопка — это разрыв в проводе, который замыкается, пока её нажимают. Сама по себе она задаёт пину уровень только в нажатом состоянии. В отпущенном пин всё равно нужно удерживать на противоположном уровне: резистором к GND (pull-down) или резистором к 5V (pull-up).",
      },
      {
        en: "The easiest wiring uses the pull-up that is built into the board: connect the button between the pin and GND and write pinMode(pin, INPUT_PULLUP). Then released reads HIGH and pressed reads LOW. Forgetting that the logic is inverted is the most common button bug.",
        kk: "Ең оңай қосылу платаға кіріктірілген pull-up резисторын пайдаланады: батырманы пин мен GND арасына қосып, pinMode(pin, INPUT_PULLUP) деп жаз. Сонда жіберулі батырма HIGH, басылған батырма LOW болып оқылады. Логиканың керісінше екенін ұмыту — батырмаға қатысты ең жиі кездесетін қате.",
        ru: "Проще всего использовать подтяжку, встроенную в плату: подключи кнопку между пином и GND и напиши pinMode(pin, INPUT_PULLUP). Тогда отпущенная кнопка читается как HIGH, а нажатая — как LOW. Забыть, что логика перевёрнута, — самая частая ошибка с кнопками.",
      },
      {
        en: "Real contacts bounce: for a few milliseconds after a press they flicker on and off. Code that counts presses will count some of them twice unless it waits about 30 ms after each change. And never let a button connect 5V to GND directly: that is a short circuit.",
        kk: "Нағыз контактілер ыршиды: басқаннан кейін бірнеше миллисекунд бойы олар қосылып-өшіп тұрады. Басуларды санайтын код әр өзгерістен кейін шамамен 30 мс күтпесе, кейбірін екі рет санайды. Сондай-ақ батырманың 5V-ты тікелей GND-ға қосуына ешқашан жол берме: бұл — қысқа тұйықталу.",
        ru: "Настоящие контакты дребезжат: несколько миллисекунд после нажатия они то замыкаются, то размыкаются. Код, который считает нажатия, посчитает некоторые дважды, если не будет ждать около 30 мс после каждого изменения. И никогда не допускай, чтобы кнопка соединяла 5V с GND напрямую: это короткое замыкание.",
      },
    ],
    rule: {
      en: "For any button ask three things: what holds the pin when released, which level means pressed, and what about bounce?",
      kk: "Кез келген батырма туралы үш нәрсе сұра: жіберулі кезде пинді не ұстайды, қай деңгей «басылған» дегенді білдіреді және контактілердің ыршуы ескерілген бе?",
      ru: "Про любую кнопку спроси три вещи: что удерживает пин в отпущенном состоянии, какой уровень означает «нажато» и что с дребезгом?",
    },
  },
  {
    slug: "sensors",
    title: {
      en: "Sensors: yes-or-no and how-much",
      kk: "Датчиктер: «иә-жоқ» және «қаншалықты»",
      ru: "Датчики: «да или нет» и «сколько»",
    },
    summary: {
      en: "Two kinds of questions a board can ask the world.",
      kk: "Плата әлемге қоя алатын сұрақтардың екі түрі.",
      ru: "Два вида вопросов, которые плата может задать миру.",
    },
    body: [
      {
        en: "Some sensors answer yes or no: a button, a motion detector, a line sensor. They are read with digitalRead(), which returns HIGH or LOW. Others answer how much: a knob, a light sensor, a temperature sensor. They are read with analogRead() on pins A0 to A5, which returns 0 to 1023.",
        kk: "Кейбір датчиктер «иә» немесе «жоқ» деп жауап береді: батырма, қозғалыс датчигі, сызық датчигі. Олар HIGH немесе LOW қайтаратын digitalRead() арқылы оқылады. Басқалары «қаншалықты» деп жауап береді: тұтқа, жарық датчигі, температура датчигі. Олар A0–A5 пиндерінде 0-ден 1023-ке дейін қайтаратын analogRead() арқылы оқылады.",
        ru: "Одни датчики отвечают «да» или «нет»: кнопка, датчик движения, датчик линии. Их читают через digitalRead(), который возвращает HIGH или LOW. Другие отвечают «сколько»: ручка, датчик света, датчик температуры. Их читают через analogRead() на пинах A0–A5, который возвращает от 0 до 1023.",
      },
      {
        en: "The board can only measure voltage. Many simple sensors, like a photoresistor, change their resistance instead. To get a voltage out of them, put the sensor and a fixed resistor in a row between 5V and GND and read the point between them. This is a voltage divider; a potentiometer is one in a single package.",
        kk: "Плата тек кернеуді өлшей алады. Фоторезистор сияқты көптеген қарапайым датчиктер оның орнына кедергісін өзгертеді. Олардан кернеу алу үшін датчик пен тұрақты резисторды 5V мен GND арасына бірінен соң бірін қойып, екеуінің арасындағы нүктені оқы. Бұл — кернеу бөлгіш; потенциометр — бір корпустағы дәл сондай бөлгіш.",
        ru: "Плата умеет измерять только напряжение. Многие простые датчики, например фоторезистор, вместо этого меняют сопротивление. Чтобы получить от них напряжение, поставь датчик и постоянный резистор друг за другом между 5V и GND и читай точку между ними. Это делитель напряжения; потенциометр — такой же делитель в одном корпусе.",
      },
      {
        en: "Sensor modules with their own chip, like the HC-SR04 distance sensor, need power as well as signal wires: VCC to 5V, GND to GND. If a reading is stuck at 0 or at 1023 no matter what you do, the sensor is probably missing one of its connections.",
        kk: "HC-SR04 қашықтық датчигі сияқты өз микросхемасы бар датчик модульдеріне сигнал сымдарымен қатар қорек те керек: VCC — 5V-қа, GND — GND-ға. Не істесең де көрсеткіш 0-де немесе 1023-те тұрып қалса, датчиктің бір қосылысы жоқ болуы әбден мүмкін.",
        ru: "Модулям датчиков с собственной микросхемой, например датчику расстояния HC-SR04, кроме сигнальных проводов нужно питание: VCC к 5V, GND к GND. Если показание застряло на 0 или на 1023, что бы ты ни делал, у датчика, скорее всего, не хватает одного из соединений.",
      },
    ],
    rule: {
      en: "A reading stuck at one end of the range is a wiring clue, not a broken sensor.",
      kk: "Ауқымның бір шетінде тұрып қалған көрсеткіш — датчиктің бұзылғаны емес, сызбадағы қатенің белгісі.",
      ru: "Показание, застрявшее на краю диапазона, — подсказка про схему, а не сломанный датчик.",
    },
  },
  {
    slug: "code-traps",
    title: {
      en: "Code that looks right",
      kk: "Дұрыс көрінетін код",
      ru: "Код, который выглядит правильным",
    },
    summary: {
      en: "Three mistakes the compiler will not warn you about.",
      kk: "Компилятор ескертпейтін үш қате.",
      ru: "Три ошибки, о которых компилятор не предупредит.",
    },
    body: [
      {
        en: "= and == are different. A single = stores a value; a double == compares. Writing if (x = 5) stores 5 in x and always counts as true. When a condition seems to be true all the time, look at its equals signs first.",
        kk: "= және == — әртүрлі нәрсе. Жалғыз = мәнді сақтайды; қос == салыстырады. if (x = 5) деп жазу x-ке 5 мәнін сақтайды және әрдайым ақиқат болып саналады. Шарт үнемі ақиқат болып тұрғандай көрінсе, алдымен оның теңдік белгілеріне қара.",
        ru: "= и == — разные вещи. Одиночный = сохраняет значение; двойной == сравнивает. Запись if (x = 5) сохраняет 5 в x и всегда считается истиной. Если условие как будто истинно всё время, первым делом посмотри на знаки равенства.",
      },
      {
        en: "Whole numbers divide into whole numbers. 5 / 1023 is 0, and 7 / 2 is 3. If you need the fraction, write at least one number with a decimal point (5.0 / 1023) and store the result in a float.",
        kk: "Бүтін сандарды бөлгенде бүтін сан шығады. 5 / 1023 — 0, ал 7 / 2 — 3. Бөлшек бөлігі керек болса, кемінде бір санды ондық нүктемен жаз (5.0 / 1023) және нәтижені float түрінде сақта.",
        ru: "Целые числа делятся нацело. 5 / 1023 — это 0, а 7 / 2 — это 3. Если нужна дробная часть, запиши хотя бы одно число с десятичной точкой (5.0 / 1023) и сохрани результат в float.",
      },
      {
        en: "Every type has a size. On the Uno an int holds −32 768 to 32 767; a byte holds 0 to 255. A number that does not fit wraps around to a wrong value without any error. Use long or unsigned long for big numbers such as time from millis().",
        kk: "Әр түрдің өз өлшемі бар. Uno-да int −32 768-ден 32 767-ге дейін, ал byte 0-ден 255-ке дейін сақтайды. Сыймайтын сан ешқандай қате шығармай, бұрыс мәнге айналады. millis() беретін уақыт сияқты үлкен сандар үшін long немесе unsigned long қолдан.",
        ru: "У каждого типа есть размер. На Uno int вмещает от −32 768 до 32 767, а byte — от 0 до 255. Число, которое не помещается, без всякой ошибки «переворачивается» в неверное значение. Для больших чисел, например времени из millis(), используй long или unsigned long.",
      },
    ],
    rule: {
      en: "If the circuit is right and the result is always the same wrong number, suspect the arithmetic.",
      kk: "Сызба дұрыс, ал нәтиже үнемі бір қате сан болса, есептеуден күдіктен.",
      ru: "Если схема верна, а результат всегда одно и то же неверное число, подозревай арифметику.",
    },
  },
];

// The order lessons are read in: from zero to tricky.
const ORDER = [
  "electricity",
  "circuit",
  "reading-diagrams",
  "led-resistor",
  "what-is-arduino",
  "sketch-structure",
  "breadboard",
  "digital-pins",
  "buttons",
  "analog-pwm",
  "sensors",
  "serial",
  "special-pins",
  "power",
  "timing",
  "code-traps",
  "debugging",
];

export const lessons: Lesson[] = ORDER.map((slug) => {
  const lesson = catalog.find((l) => l.slug === slug);
  if (!lesson) throw new Error(`Unknown lesson "${slug}"`);
  return lesson;
});
