/**
 * ConcursaJá - Main JavaScript
 * Plataforma de Estudos para Concursos Públicos
 * 
 * @version 1.0.0
 * @author ConcursaJá Team
 */

'use strict';

// =============================================================================
// 1. CONFIGURATION & DATA
// =============================================================================

const CONFIG = {
    storageKey: 'concursaja_data',
    animationDuration: 300,
    toastDuration: 4000,
    pomodoroWork: 25 * 60,
    pomodoroBreak: 5 * 60,
    pomodoroLongBreak: 15 * 60
};

// Banco de Questões por Matéria
const QUESTIONS_DATABASE = {
    portugues: [
        {
            id: 'pt-1',
            question: 'Assinale a alternativa em que a concordância verbal está CORRETA:',
            options: [
                'Fazem dez anos que não viajo.',
                'Houveram muitos problemas na reunião.',
                'Existem várias soluções para o problema.',
                'Haviam chegado os convidados.'
            ],
            correct: 2,
            explanation: 'O verbo "existir" concorda normalmente com o sujeito. "Várias soluções" é plural, portanto "existem".'
        },
        {
            id: 'pt-2',
            question: 'Identifique a figura de linguagem presente em: "A cidade dormia tranquilamente."',
            options: [
                'Metáfora',
                'Prosopopeia (Personificação)',
                'Hipérbole',
                'Metonímia'
            ],
            correct: 1,
            explanation: 'Prosopopeia ou personificação atribui características humanas a seres inanimados. A cidade não dorme literalmente.'
        },
        {
            id: 'pt-3',
            question: 'Assinale a alternativa com a correta classificação do "que":',
            options: [
                '"O livro que li é bom" - conjunção integrante',
                '"Espero que você venha" - pronome relativo',
                '"Que dia lindo!" - advérbio de intensidade',
                '"Espero que você venha" - conjunção integrante'
            ],
            correct: 3,
            explanation: 'Na frase "Espero que você venha", o "que" é conjunção integrante pois introduz oração subordinada substantiva.'
        },
        {
            id: 'pt-4',
            question: 'A crase está corretamente empregada em:',
            options: [
                'Refiro-me à você e aos seus amigos.',
                'Chegaremos à Brasília amanhã cedo.',
                'Dedicou-se à música desde criança.',
                'Fui à pé até a escola.'
            ],
            correct: 2,
            explanation: '"Dedicar-se a algo" - a preposição "a" + artigo "a" antes de "música" = crase obrigatória.'
        },
        {
            id: 'pt-5',
            question: 'Assinale a alternativa que apresenta um período composto por subordinação:',
            options: [
                'Estudei muito, porém não passei.',
                'Quando cheguei, todos já haviam saído.',
                'O dia amanheceu e eu acordei.',
                'Ou você estuda, ou você trabalha.'
            ],
            correct: 1,
            explanation: '"Quando cheguei" é uma oração subordinada adverbial temporal, caracterizando subordinação.'
        },
        {
            id: 'pt-6',
            question: 'O plural de "cidadão" e "alemão" é, respectivamente:',
            options: [
                'cidadãos - alemãos',
                'cidadões - alemães',
                'cidadãos - alemães',
                'cidadões - alemãos'
            ],
            correct: 2,
            explanation: 'Cidadão faz plural em -ãos (cidadãos). Alemão faz plural em -ães (alemães).'
        },
        {
            id: 'pt-7',
            question: 'Identifique a oração que contém sujeito indeterminado:',
            options: [
                'Choveu muito ontem à noite.',
                'Vendem-se casas nesta rua.',
                'Precisa-se de funcionários experientes.',
                'Havia muitas pessoas na festa.'
            ],
            correct: 2,
            explanation: 'Com VTI + "se", o sujeito é indeterminado. "Precisa-se de funcionários" - VTI (precisar de).'
        },
        {
            id: 'pt-8',
            question: 'Assinale a alternativa com a regência verbal CORRETA:',
            options: [
                'O filme que assisti foi ótimo.',
                'Prefiro mais estudar do que trabalhar.',
                'Ela namora com o vizinho.',
                'Aspiro ao cargo de diretor.'
            ],
            correct: 3,
            explanation: 'Aspirar no sentido de almejar é VTI e exige a preposição "a". Aspiro ao cargo (almejo o cargo).'
        },
        {
            id: 'pt-9',
            question: 'O texto apresenta função emotiva quando:',
            options: [
                'Centra-se no emissor e expressa sentimentos.',
                'Centra-se no receptor e usa imperativos.',
                'Centra-se no código e explica a linguagem.',
                'Centra-se no contexto e informa dados.'
            ],
            correct: 0,
            explanation: 'A função emotiva ou expressiva centra-se no emissor, expressando seus sentimentos e emoções.'
        },
        {
            id: 'pt-10',
            question: 'Assinale a alternativa em que a vírgula está empregada INCORRETAMENTE:',
            options: [
                'Maria, minha vizinha, é médica.',
                'Estudou muito, portanto passou.',
                'Brasília, capital do Brasil é moderna.',
                'Se você vier, farei um bolo.'
            ],
            correct: 2,
            explanation: 'O aposto explicativo "capital do Brasil" deve vir entre vírgulas: "Brasília, capital do Brasil, é moderna."'
        }
    ],
    matematica: [
        {
            id: 'mat-1',
            question: 'Se 3x + 5 = 20, qual o valor de x?',
            options: ['3', '4', '5', '6'],
            correct: 2,
            explanation: '3x + 5 = 20 → 3x = 15 → x = 5'
        },
        {
            id: 'mat-2',
            question: 'Um produto custa R$ 80,00 e teve um desconto de 15%. Qual o valor final?',
            options: ['R$ 65,00', 'R$ 68,00', 'R$ 70,00', 'R$ 72,00'],
            correct: 1,
            explanation: 'Desconto: 80 × 0,15 = 12. Valor final: 80 - 12 = R$ 68,00'
        },
        {
            id: 'mat-3',
            question: 'A razão entre dois números é 3/5. Se a soma deles é 80, qual é o maior número?',
            options: ['30', '40', '48', '50'],
            correct: 3,
            explanation: 'Se a razão é 3/5, os números são 3k e 5k. 3k + 5k = 80 → 8k = 80 → k = 10. Maior: 5 × 10 = 50'
        },
        {
            id: 'mat-4',
            question: 'Qual é a área de um triângulo com base 10 cm e altura 8 cm?',
            options: ['40 cm²', '80 cm²', '18 cm²', '36 cm²'],
            correct: 0,
            explanation: 'Área do triângulo = (base × altura) / 2 = (10 × 8) / 2 = 40 cm²'
        },
        {
            id: 'mat-5',
            question: 'Em uma progressão aritmética, o primeiro termo é 3 e a razão é 4. Qual é o 10º termo?',
            options: ['39', '40', '43', '36'],
            correct: 0,
            explanation: 'an = a1 + (n-1)r → a10 = 3 + (10-1)×4 = 3 + 36 = 39'
        },
        {
            id: 'mat-6',
            question: 'Qual é o MMC de 12, 18 e 24?',
            options: ['48', '72', '96', '144'],
            correct: 1,
            explanation: '12 = 2² × 3, 18 = 2 × 3², 24 = 2³ × 3. MMC = 2³ × 3² = 8 × 9 = 72'
        },
        {
            id: 'mat-7',
            question: 'Se log₁₀ 2 ≈ 0,30, quanto vale aproximadamente log₁₀ 8?',
            options: ['0,60', '0,90', '1,20', '2,40'],
            correct: 1,
            explanation: 'log 8 = log 2³ = 3 × log 2 = 3 × 0,30 = 0,90'
        },
        {
            id: 'mat-8',
            question: 'Uma equação do 2º grau tem raízes 2 e -3. Qual é essa equação?',
            options: [
                'x² + x - 6 = 0',
                'x² - x - 6 = 0',
                'x² + x + 6 = 0',
                'x² - x + 6 = 0'
            ],
            correct: 0,
            explanation: 'Soma das raízes: 2 + (-3) = -1 = -b/a. Produto: 2 × (-3) = -6 = c/a. Logo: x² + x - 6 = 0'
        },
        {
            id: 'mat-9',
            question: 'Quantos anagramas podem ser formados com a palavra "AMOR"?',
            options: ['12', '16', '20', '24'],
            correct: 3,
            explanation: 'AMOR tem 4 letras diferentes. Anagramas = 4! = 4 × 3 × 2 × 1 = 24'
        },
        {
            id: 'mat-10',
            question: 'Um capital de R$ 1.000,00 aplicado a juros simples de 2% ao mês durante 6 meses renderá:',
            options: ['R$ 100,00', 'R$ 120,00', 'R$ 126,16', 'R$ 140,00'],
            correct: 1,
            explanation: 'Juros simples: J = C × i × t = 1000 × 0,02 × 6 = R$ 120,00'
        }
    ],
    logica: [
        {
            id: 'log-1',
            question: 'Se "Todo A é B" e "Algum C é A", então podemos concluir que:',
            options: [
                'Todo C é B',
                'Algum C é B',
                'Nenhum C é B',
                'Algum B é A'
            ],
            correct: 1,
            explanation: 'Se todo A é B e algum C é A, esse "algum C" que é A também é B. Logo, algum C é B.'
        },
        {
            id: 'log-2',
            question: 'A negação de "Se chover, então a rua ficará molhada" é:',
            options: [
                'Se não chover, a rua não ficará molhada',
                'Chove e a rua não fica molhada',
                'Não chove ou a rua fica molhada',
                'Se a rua ficar molhada, então choveu'
            ],
            correct: 1,
            explanation: 'A negação de P→Q é P∧~Q. Negação de "Se chover, rua molhada" é "Chove E rua não molhada".'
        },
        {
            id: 'log-3',
            question: 'Complete a sequência: 2, 6, 12, 20, 30, ...',
            options: ['40', '42', '44', '46'],
            correct: 1,
            explanation: 'Diferenças: 4, 6, 8, 10, 12. Próximo: 30 + 12 = 42. Ou: n×(n+1) → 6×7 = 42'
        },
        {
            id: 'log-4',
            question: 'Ana é mais alta que Bia. Carla é mais baixa que Bia. Diana é mais alta que Ana. Quem é a mais baixa?',
            options: ['Ana', 'Bia', 'Carla', 'Diana'],
            correct: 2,
            explanation: 'Ordenando: Diana > Ana > Bia > Carla. Logo, Carla é a mais baixa.'
        },
        {
            id: 'log-5',
            question: 'Em uma família, Pedro é pai de João. João é irmão de Maria. Paulo é filho de Maria. Qual é o parentesco entre Pedro e Paulo?',
            options: ['Pai', 'Avô', 'Tio', 'Primo'],
            correct: 1,
            explanation: 'Pedro é pai de João e Maria (irmãos). Paulo é filho de Maria. Logo, Pedro é avô de Paulo.'
        },
        {
            id: 'log-6',
            question: 'Qual é o valor lógico de (V ∧ F) → V?',
            options: [
                'Verdadeiro',
                'Falso',
                'Indeterminado',
                'Contraditório'
            ],
            correct: 0,
            explanation: 'V ∧ F = F. F → V = V (uma implicação com antecedente falso é sempre verdadeira).'
        },
        {
            id: 'log-7',
            question: 'Se "Nenhum gato é cachorro" é verdadeira, então é FALSO afirmar que:',
            options: [
                'Algum cachorro não é gato',
                'Algum gato é cachorro',
                'Todo cachorro não é gato',
                'Nenhum cachorro é gato'
            ],
            correct: 1,
            explanation: 'Se nenhum gato é cachorro, é falso que "algum gato é cachorro".'
        },
        {
            id: 'log-8',
            question: 'Em um grupo, 60% gostam de futebol e 40% gostam de vôlei. Se 20% gostam de ambos, qual porcentagem não gosta de nenhum?',
            options: ['10%', '20%', '30%', '40%'],
            correct: 1,
            explanation: 'Pelo princípio da inclusão-exclusão: 60 + 40 - 20 = 80% gostam de pelo menos um. Logo, 20% não gostam de nenhum.'
        },
        {
            id: 'log-9',
            question: 'Complete a sequência de letras: A, C, F, J, O, ...',
            options: ['T', 'U', 'V', 'S'],
            correct: 1,
            explanation: 'Os intervalos são: +2, +3, +4, +5, +6. De O (15ª letra) + 6 = U (21ª letra).'
        },
        {
            id: 'log-10',
            question: 'A proposição equivalente a "Se estudo, passo" é:',
            options: [
                'Se passo, estudo',
                'Se não estudo, não passo',
                'Não estudo ou passo',
                'Estudo e passo'
            ],
            correct: 2,
            explanation: 'P → Q é equivalente a ~P ∨ Q. "Se estudo, passo" equivale a "Não estudo OU passo".'
        }
    ],
    constitucional: [
        {
            id: 'const-1',
            question: 'Segundo a Constituição Federal, são Poderes da União, independentes e harmônicos entre si:',
            options: [
                'Executivo, Legislativo e Federativo',
                'Executivo, Legislativo e Judiciário',
                'Federal, Estadual e Municipal',
                'Executivo, Moderador e Legislativo'
            ],
            correct: 1,
            explanation: 'Art. 2º CF: "São Poderes da União, independentes e harmônicos entre si, o Legislativo, o Executivo e o Judiciário."'
        },
        {
            id: 'const-2',
            question: 'A República Federativa do Brasil tem como fundamentos, EXCETO:',
            options: [
                'A soberania',
                'A cidadania',
                'O desenvolvimento nacional',
                'Os valores sociais do trabalho e da livre iniciativa'
            ],
            correct: 2,
            explanation: 'Desenvolvimento nacional é OBJETIVO (art. 3º), não fundamento. Fundamentos (art. 1º): soberania, cidadania, dignidade da pessoa humana, valores sociais do trabalho e livre iniciativa, pluralismo político.'
        },
        {
            id: 'const-3',
            question: 'É direito fundamental assegurado pela CF/88 aos presos:',
            options: [
                'Trabalho remunerado obrigatório',
                'Identificação dos responsáveis por sua prisão',
                'Progressão de regime automática',
                'Visita íntima irrestrita'
            ],
            correct: 1,
            explanation: 'Art. 5º, LXIV: "o preso tem direito à identificação dos responsáveis por sua prisão ou por seu interrogatório policial".'
        },
        {
            id: 'const-4',
            question: 'A ação popular pode ser proposta por:',
            options: [
                'Qualquer pessoa física ou jurídica',
                'Apenas o Ministério Público',
                'Qualquer cidadão',
                'Apenas partidos políticos'
            ],
            correct: 2,
            explanation: 'Art. 5º, LXXIII: "qualquer CIDADÃO é parte legítima para propor ação popular..."'
        },
        {
            id: 'const-5',
            question: 'O habeas data serve para:',
            options: [
                'Garantir o direito de locomoção',
                'Obter informações de interesse particular',
                'Conhecer ou retificar informações pessoais em bancos de dados',
                'Anular ato lesivo ao patrimônio público'
            ],
            correct: 2,
            explanation: 'Art. 5º, LXXII: habeas data para conhecer ou retificar informações pessoais em registros ou bancos de dados.'
        },
        {
            id: 'const-6',
            question: 'São cláusulas pétreas da Constituição Federal, EXCETO:',
            options: [
                'A forma federativa de Estado',
                'O voto direto, secreto, universal e periódico',
                'A separação dos Poderes',
                'O sistema presidencialista'
            ],
            correct: 3,
            explanation: 'Art. 60, §4º: cláusulas pétreas são forma federativa, voto direto/secreto/universal/periódico, separação dos poderes e direitos individuais. Sistema presidencialista não é cláusula pétrea.'
        },
        {
            id: 'const-7',
            question: 'A idade mínima para ser eleito Presidente da República é:',
            options: ['30 anos', '35 anos', '40 anos', '21 anos'],
            correct: 1,
            explanation: 'Art. 14, §3º, VI, "a": 35 anos para Presidente, Vice-Presidente e Senador.'
        },
        {
            id: 'const-8',
            question: 'Compete privativamente à União legislar sobre:',
            options: [
                'Educação',
                'Meio ambiente',
                'Direito civil',
                'Proteção à infância'
            ],
            correct: 2,
            explanation: 'Art. 22, I: compete privativamente à União legislar sobre direito civil, comercial, penal, processual, etc.'
        },
        {
            id: 'const-9',
            question: 'O mandato do Presidente da República é de:',
            options: [
                '4 anos, vedada a reeleição',
                '4 anos, permitida uma reeleição',
                '5 anos, vedada a reeleição',
                '5 anos, permitida uma reeleição'
            ],
            correct: 1,
            explanation: 'Art. 82: "O mandato do Presidente da República é de quatro anos" e EC 16/97 permite uma reeleição.'
        },
        {
            id: 'const-10',
            question: 'O Supremo Tribunal Federal é composto por:',
            options: [
                '9 Ministros',
                '11 Ministros',
                '15 Ministros',
                '21 Ministros'
            ],
            correct: 1,
            explanation: 'Art. 101: "O Supremo Tribunal Federal compõe-se de onze Ministros..."'
        }
    ],
    administrativo: [
        {
            id: 'adm-1',
            question: 'São princípios expressos da Administração Pública no art. 37 da CF:',
            options: [
                'Legalidade, impessoalidade, moralidade, publicidade e eficiência',
                'Legalidade, legitimidade, moralidade, publicidade e economicidade',
                'Legalidade, impessoalidade, motivação, publicidade e eficiência',
                'Supremacia do interesse público, indisponibilidade, legalidade e impessoalidade'
            ],
            correct: 0,
            explanation: 'Art. 37, caput, CF: LIMPE - Legalidade, Impessoalidade, Moralidade, Publicidade e Eficiência.'
        },
        {
            id: 'adm-2',
            question: 'Quanto à autoexecutoriedade dos atos administrativos, é correto afirmar que:',
            options: [
                'Todos os atos administrativos são autoexecutórios',
                'Permite que a Administração execute o ato sem intervenção do Judiciário',
                'Exige sempre autorização judicial prévia',
                'É exclusiva dos atos vinculados'
            ],
            correct: 1,
            explanation: 'Autoexecutoriedade permite à Administração executar diretamente suas decisões sem precisar recorrer ao Judiciário.'
        },
        {
            id: 'adm-3',
            question: 'A modalidade de licitação obrigatória para concessão de serviço público é:',
            options: [
                'Tomada de preços',
                'Convite',
                'Concorrência',
                'Pregão'
            ],
            correct: 2,
            explanation: 'Art. 2º, II, Lei 8.987/95: concessão de serviço público exige licitação na modalidade concorrência.'
        },
        {
            id: 'adm-4',
            question: 'O ato administrativo que contém vício de competência:',
            options: [
                'É sempre nulo e não pode ser convalidado',
                'Pode ser convalidado, em regra, se não for exclusiva',
                'Deve ser revogado pela Administração',
                'Só pode ser anulado pelo Poder Judiciário'
            ],
            correct: 1,
            explanation: 'Vício de competência pode ser convalidado (ratificação) quando a competência não for exclusiva.'
        },
        {
            id: 'adm-5',
            question: 'São formas de provimento originário em cargo público:',
            options: [
                'Nomeação e readaptação',
                'Apenas a nomeação',
                'Nomeação e reversão',
                'Nomeação e reintegração'
            ],
            correct: 1,
            explanation: 'Provimento originário é aquele que não depende de vínculo anterior. Apenas a NOMEAÇÃO é originária.'
        },
        {
            id: 'adm-6',
            question: 'O poder disciplinar da Administração Pública:',
            options: [
                'Aplica-se a todos os cidadãos indistintamente',
                'Apura infrações e aplica penalidades a servidores e particulares com vínculo específico',
                'É sinônimo de poder de polícia',
                'Independe de processo administrativo'
            ],
            correct: 1,
            explanation: 'Poder disciplinar apura infrações e aplica penalidades aos servidores e particulares sujeitos à disciplina administrativa.'
        },
        {
            id: 'adm-7',
            question: 'A desapropriação por interesse social, para fins de reforma agrária, compete:',
            options: [
                'À União, aos Estados e Municípios',
                'Exclusivamente à União',
                'À União e aos Estados',
                'Exclusivamente aos Estados'
            ],
            correct: 1,
            explanation: 'Art. 184, CF: compete à UNIÃO desapropriar por interesse social, para fins de reforma agrária.'
        },
        {
            id: 'adm-8',
            question: 'O prazo prescricional para ação de reparação de danos contra a Fazenda Pública é de:',
            options: [
                '3 anos',
                '5 anos',
                '10 anos',
                '20 anos'
            ],
            correct: 1,
            explanation: 'Decreto 20.910/32: prescrição quinquenal (5 anos) para ações contra a Fazenda Pública.'
        },
        {
            id: 'adm-9',
            question: 'A anulação de atos administrativos pela própria Administração decorre do:',
            options: [
                'Poder hierárquico',
                'Poder disciplinar',
                'Princípio da autotutela',
                'Poder regulamentar'
            ],
            correct: 2,
            explanation: 'Autotutela: a Administração pode rever seus próprios atos, anulando os ilegais ou revogando os inconvenientes.'
        },
        {
            id: 'adm-10',
            question: 'São entidades da Administração Indireta:',
            options: [
                'Autarquias, fundações públicas, empresas públicas e sociedades de economia mista',
                'Ministérios, secretarias e autarquias',
                'Órgãos públicos e autarquias',
                'Agências reguladoras apenas'
            ],
            correct: 0,
            explanation: 'Art. 37, XIX e Decreto-Lei 200/67: Administração Indireta = autarquias, fundações públicas, empresas públicas e sociedades de economia mista.'
        }
    ],
    informatica: [
        {
            id: 'inf-1',
            question: 'No Windows 10, o atalho de teclado para abrir o Gerenciador de Tarefas é:',
            options: [
                'Ctrl + Alt + Del',
                'Ctrl + Shift + Esc',
                'Alt + F4',
                'Windows + R'
            ],
            correct: 1,
            explanation: 'Ctrl + Shift + Esc abre diretamente o Gerenciador de Tarefas. Ctrl + Alt + Del abre tela de opções.'
        },
        {
            id: 'inf-2',
            question: 'No Microsoft Word, para selecionar todo o documento, utiliza-se:',
            options: [
                'Ctrl + T',
                'Ctrl + A',
                'Ctrl + S',
                'Ctrl + P'
            ],
            correct: 1,
            explanation: 'Ctrl + A (All) seleciona todo o documento. Ctrl + T abre a caixa de fonte.'
        },
        {
            id: 'inf-3',
            question: 'Qual protocolo é utilizado para envio de e-mails?',
            options: [
                'POP3',
                'IMAP',
                'SMTP',
                'FTP'
            ],
            correct: 2,
            explanation: 'SMTP (Simple Mail Transfer Protocol) é usado para ENVIO. POP3 e IMAP são para recebimento.'
        },
        {
            id: 'inf-4',
            question: 'No Excel, a função que retorna a média aritmética de um conjunto de valores é:',
            options: [
                '=SOMA()',
                '=MEDIA()',
                '=MÉDIA()',
                '=AVERAGE()'
            ],
            correct: 2,
            explanation: 'No Excel em português, usa-se =MÉDIA(). No Excel em inglês, seria =AVERAGE().'
        },
        {
            id: 'inf-5',
            question: 'Um software malicioso que se propaga inserindo cópias de si mesmo em outros programas é chamado de:',
            options: [
                'Worm',
                'Vírus',
                'Trojan',
                'Spyware'
            ],
            correct: 1,
            explanation: 'Vírus precisa de um hospedeiro (programa) para se propagar. Worm se propaga sozinho pela rede.'
        },
        {
            id: 'inf-6',
            question: 'O backup incremental:',
            options: [
                'Copia todos os arquivos do sistema',
                'Copia apenas os arquivos modificados desde o último backup completo',
                'Copia apenas os arquivos modificados desde o último backup (completo ou incremental)',
                'Copia apenas arquivos do sistema operacional'
            ],
            correct: 2,
            explanation: 'Backup incremental copia apenas arquivos alterados desde o último backup de qualquer tipo.'
        },
        {
            id: 'inf-7',
            question: 'Qual é a capacidade de armazenamento de um DVD de camada única?',
            options: [
                '700 MB',
                '4,7 GB',
                '8,5 GB',
                '25 GB'
            ],
            correct: 1,
            explanation: 'DVD single layer: 4,7 GB. DVD dual layer: 8,5 GB. CD: 700 MB. Blu-ray: 25 GB.'
        },
        {
            id: 'inf-8',
            question: 'No Linux, o comando utilizado para listar o conteúdo de um diretório é:',
            options: [
                'dir',
                'ls',
                'list',
                'show'
            ],
            correct: 1,
            explanation: 'ls (list) lista arquivos e diretórios no Linux. "dir" é o equivalente no Windows/DOS.'
        },
        {
            id: 'inf-9',
            question: 'O que é computação em nuvem (cloud computing)?',
            options: [
                'Processamento exclusivo em servidores locais',
                'Modelo de oferta de serviços de TI pela internet sob demanda',
                'Sistema operacional específico para redes',
                'Tipo de criptografia de dados'
            ],
            correct: 1,
            explanation: 'Cloud computing oferece recursos de TI (armazenamento, processamento) pela internet, sob demanda.'
        },
        {
            id: 'inf-10',
            question: 'O firewall é um dispositivo de segurança que:',
            options: [
                'Remove vírus do computador',
                'Criptografa arquivos do usuário',
                'Controla o tráfego de rede segundo regras de segurança',
                'Realiza backup automático dos dados'
            ],
            correct: 2,
            explanation: 'Firewall filtra/controla o tráfego de rede, permitindo ou bloqueando conexões conforme regras definidas.'
        }
    ]
};

// =============================================================================
// 2. UTILITY FUNCTIONS
// =============================================================================

/**
 * Debounce function to limit function execution rate
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function to limit function calls
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Format time from seconds to MM:SS
 */
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Generate random ID
 */
function generateId() {
    return Math.random().toString(36).substring(2, 15);
}

/**
 * Shuffle array (Fisher-Yates)
 */
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// =============================================================================
// 3. LOCAL STORAGE MANAGEMENT
// =============================================================================

const Storage = {
    getData() {
        try {
            const data = localStorage.getItem(CONFIG.storageKey);
            return data ? JSON.parse(data) : this.getDefaultData();
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return this.getDefaultData();
        }
    },

    saveData(data) {
        try {
            localStorage.setItem(CONFIG.storageKey, JSON.stringify(data));
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }
    },

    getDefaultData() {
        return {
            theme: 'light',
            progress: {
                portugues: 0,
                ingles: 0,
                matematica: 0,
                logica: 0,
                constitucional: 0,
                administrativo: 0,
                eleitoral: 0,
                financeira: 0,
                bancarios: 0,
                informatica: 0,
                atualidades: 0,
                etica: 0
            },
            stats: {
                aulasAssistidas: 0,
                questoesResolvidas: 0,
                questoesCorretas: 0,
                diasConsecutivos: 0,
                ultimoAcesso: null,
                pomodoroSessions: 0
            },
            activities: [],
            simuladoHistory: []
        };
    },

    updateProgress(materia, value) {
        const data = this.getData();
        data.progress[materia] = Math.min(100, Math.max(0, value));
        this.saveData(data);
        return data.progress[materia];
    },

    updateStats(statKey, value) {
        const data = this.getData();
        data.stats[statKey] = value;
        this.saveData(data);
    },

    incrementStat(statKey, amount = 1) {
        const data = this.getData();
        data.stats[statKey] = (data.stats[statKey] || 0) + amount;
        this.saveData(data);
        return data.stats[statKey];
    },

    addActivity(activity) {
        const data = this.getData();
        data.activities.unshift({
            ...activity,
            id: generateId(),
            timestamp: Date.now()
        });
        // Keep only last 20 activities
        data.activities = data.activities.slice(0, 20);
        this.saveData(data);
    },

    addSimuladoResult(result) {
        const data = this.getData();
        data.simuladoHistory.unshift({
            ...result,
            id: generateId(),
            timestamp: Date.now()
        });
        // Keep only last 50 simulados
        data.simuladoHistory = data.simuladoHistory.slice(0, 50);
        this.saveData(data);
    },

    checkStreak() {
        const data = this.getData();
        const today = new Date().toDateString();
        const lastAccess = data.stats.ultimoAcesso;
        
        if (lastAccess) {
            const lastDate = new Date(lastAccess).toDateString();
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastDate === today) {
                // Same day, no change
            } else if (lastDate === yesterday.toDateString()) {
                // Consecutive day
                data.stats.diasConsecutivos++;
            } else {
                // Streak broken
                data.stats.diasConsecutivos = 1;
            }
        } else {
            data.stats.diasConsecutivos = 1;
        }
        
        data.stats.ultimoAcesso = Date.now();
        this.saveData(data);
        return data.stats.diasConsecutivos;
    }
};

// =============================================================================
// 4. THEME MANAGEMENT
// =============================================================================

const ThemeManager = {
    init() {
        const data = Storage.getData();
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = data.theme || (prefersDark ? 'dark' : 'light');
        this.setTheme(theme);
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!data.theme) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    },

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        const data = Storage.getData();
        data.theme = theme;
        Storage.saveData(data);
    },

    toggle() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
};

// =============================================================================
// 5. TOAST NOTIFICATIONS
// =============================================================================

const Toast = {
    show(type, title, message, duration = CONFIG.toastDuration) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        
        const icons = {
            success: 'fa-check',
            error: 'fa-times',
            warning: 'fa-exclamation',
            info: 'fa-info'
        };
        
        toast.innerHTML = `
            <div class="toast__icon">
                <i class="fas ${icons[type]}"></i>
            </div>
            <div class="toast__content">
                <div class="toast__title">${title}</div>
                <div class="toast__message">${message}</div>
            </div>
            <button class="toast__close" aria-label="Fechar">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(toast);
        
        // Close button
        toast.querySelector('.toast__close').addEventListener('click', () => {
            this.hide(toast);
        });
        
        // Auto hide
        setTimeout(() => {
            this.hide(toast);
        }, duration);
    },

    hide(toast) {
        toast.classList.add('hiding');
        setTimeout(() => {
            toast.remove();
        }, CONFIG.animationDuration);
    },

    success(title, message) {
        this.show('success', title, message);
    },

    error(title, message) {
        this.show('error', title, message);
    },

    warning(title, message) {
        this.show('warning', title, message);
    },

    info(title, message) {
        this.show('info', title, message);
    }
};

// =============================================================================
// 6. HEADER & NAVIGATION
// =============================================================================

const Navigation = {
    init() {
        this.header = document.getElementById('header');
        this.nav = document.getElementById('nav');
        this.menuToggle = document.getElementById('menu-toggle');
        this.navLinks = document.querySelectorAll('.nav__link');
        
        this.bindEvents();
        this.handleScroll();
    },

    bindEvents() {
        // Mobile menu toggle
        this.menuToggle?.addEventListener('click', () => this.toggleMobileMenu());
        
        // Nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.closeMobileMenu();
                this.setActiveLink(link);
            });
        });
        
        // Scroll events
        window.addEventListener('scroll', throttle(() => this.handleScroll(), 100));
        
        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!this.nav?.contains(e.target) && !this.menuToggle?.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    },

    toggleMobileMenu() {
        const isOpen = this.nav.classList.toggle('active');
        this.menuToggle.setAttribute('aria-expanded', isOpen);
    },

    closeMobileMenu() {
        this.nav?.classList.remove('active');
        this.menuToggle?.setAttribute('aria-expanded', 'false');
    },

    handleScroll() {
        // Header shadow
        if (window.scrollY > 10) {
            this.header?.classList.add('scrolled');
        } else {
            this.header?.classList.remove('scrolled');
        }
        
        // Back to top button
        const backToTop = document.getElementById('back-to-top');
        if (window.scrollY > 500) {
            backToTop?.classList.add('visible');
        } else {
            backToTop?.classList.remove('visible');
        }
        
        // Update active nav link based on scroll position
        this.updateActiveSection();
    },

    updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos < top + height) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    },

    setActiveLink(activeLink) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }
};

// =============================================================================
// 7. COUNTER ANIMATION
// =============================================================================

const CounterAnimation = {
    init() {
        const counters = document.querySelectorAll('[data-count]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    },

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const update = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        };
        
        requestAnimationFrame(update);
    }
};

// =============================================================================
// 8. MATERIAS FILTER
// =============================================================================

const MateriasFilter = {
    init() {
        this.tabs = document.querySelectorAll('.filter-tab');
        this.cards = document.querySelectorAll('.materia-card');
        
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.filter(tab));
        });
    },

    filter(activeTab) {
        const filter = activeTab.dataset.filter;
        
        // Update tabs
        this.tabs.forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
        });
        activeTab.classList.add('active');
        activeTab.setAttribute('aria-selected', 'true');
        
        // Filter cards
        this.cards.forEach(card => {
            const category = card.dataset.category;
            if (filter === 'all' || category === filter) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeIn 0.3s ease forwards';
            } else {
                card.classList.add('hidden');
            }
        });
    }
};

// =============================================================================
// 9. SIMULADO SYSTEM
// =============================================================================

const SimuladoSystem = {
    state: {
        active: false,
        type: 'rapido',
        materias: ['portugues'],
        questions: [],
        currentIndex: 0,
        answers: [],
        startTime: null,
        timerInterval: null,
        elapsedSeconds: 0
    },

    init() {
        this.bindElements();
        this.bindEvents();
    },

    bindElements() {
        this.simuladoContainer = document.querySelector('.simulado-container');
        this.quizContainer = document.getElementById('quiz-container');
        this.resultsContainer = document.getElementById('results-container');
        this.startBtn = document.getElementById('start-simulado');
        this.typeSelectors = document.querySelectorAll('.simulado-type');
        this.materiaCheckboxes = document.querySelectorAll('input[name="simulado-materia"]');
    },

    bindEvents() {
        // Type selection
        this.typeSelectors.forEach(selector => {
            selector.addEventListener('click', () => this.selectType(selector));
        });
        
        // Start button
        this.startBtn?.addEventListener('click', () => this.start());
        
        // Navigation buttons
        document.getElementById('prev-question')?.addEventListener('click', () => this.prevQuestion());
        document.getElementById('next-question')?.addEventListener('click', () => this.nextQuestion());
        document.getElementById('finish-quiz')?.addEventListener('click', () => this.finish());
        
        // Results buttons
        document.getElementById('review-answers')?.addEventListener('click', () => this.reviewAnswers());
        document.getElementById('new-simulado')?.addEventListener('click', () => this.reset());
    },

    selectType(selector) {
        this.typeSelectors.forEach(s => s.classList.remove('active'));
        selector.classList.add('active');
        this.state.type = selector.dataset.type;
    },

    getSelectedMaterias() {
        const selected = [];
        this.materiaCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selected.push(checkbox.value);
            }
        });
        return selected;
    },

    getQuestionCount() {
        const counts = { rapido: 10, medio: 30, completo: 60 };
        return counts[this.state.type] || 10;
    },

    start() {
        const selectedMaterias = this.getSelectedMaterias();
        
        if (selectedMaterias.length === 0) {
            Toast.warning('Atenção', 'Selecione pelo menos uma matéria para iniciar o simulado.');
            return;
        }
        
        this.state.materias = selectedMaterias;
        this.state.questions = this.generateQuestions();
        
        if (this.state.questions.length === 0) {
            Toast.error('Erro', 'Não há questões disponíveis para as matérias selecionadas.');
            return;
        }
        
        this.state.currentIndex = 0;
        this.state.answers = new Array(this.state.questions.length).fill(null);
        this.state.active = true;
        this.state.startTime = Date.now();
        this.state.elapsedSeconds = 0;
        
        // Show quiz container
        this.simuladoContainer.hidden = true;
        this.quizContainer.hidden = false;
        this.resultsContainer.hidden = true;
        
        // Start timer
        this.startTimer();
        
        // Show first question
        this.showQuestion();
        
        Toast.success('Simulado Iniciado', `Boa sorte! Você tem ${this.state.questions.length} questões.`);
    },

    generateQuestions() {
        const questions = [];
        const count = this.getQuestionCount();
        const perMateria = Math.ceil(count / this.state.materias.length);
        
        this.state.materias.forEach(materia => {
            const materiaQuestions = QUESTIONS_DATABASE[materia] || [];
            const shuffled = shuffleArray(materiaQuestions);
            const selected = shuffled.slice(0, perMateria);
            
            selected.forEach(q => {
                questions.push({
                    ...q,
                    materia: materia
                });
            });
        });
        
        return shuffleArray(questions).slice(0, count);
    },

    startTimer() {
        const display = document.getElementById('timer-display');
        
        this.state.timerInterval = setInterval(() => {
            this.state.elapsedSeconds++;
            display.textContent = formatTime(this.state.elapsedSeconds);
        }, 1000);
    },

    stopTimer() {
        if (this.state.timerInterval) {
            clearInterval(this.state.timerInterval);
            this.state.timerInterval = null;
        }
    },

    showQuestion() {
        const question = this.state.questions[this.state.currentIndex];
        const total = this.state.questions.length;
        const current = this.state.currentIndex + 1;
        
        // Update header
        document.getElementById('quiz-materia').textContent = this.getMateriaName(question.materia);
        document.getElementById('current-question').textContent = current;
        document.getElementById('total-questions').textContent = total;
        
        // Update progress bar
        document.getElementById('quiz-progress-fill').style.width = `${(current / total) * 100}%`;
        
        // Update question text
        document.getElementById('question-text').textContent = question.question;
        
        // Update options
        const optionsContainer = document.getElementById('quiz-options');
        optionsContainer.innerHTML = '';
        
        const letters = ['A', 'B', 'C', 'D', 'E'];
        question.options.forEach((option, index) => {
            const div = document.createElement('div');
            div.className = 'quiz-option';
            div.dataset.index = index;
            
            if (this.state.answers[this.state.currentIndex] === index) {
                div.classList.add('selected');
            }
            
            div.innerHTML = `
                <span class="option-letter">${letters[index]}</span>
                <span class="option-text">${option}</span>
            `;
            
            div.addEventListener('click', () => this.selectAnswer(index));
            optionsContainer.appendChild(div);
        });
        
        // Update navigation buttons
        document.getElementById('prev-question').disabled = current === 1;
        
        const nextBtn = document.getElementById('next-question');
        const finishBtn = document.getElementById('finish-quiz');
        
        if (current === total) {
            nextBtn.hidden = true;
            finishBtn.hidden = false;
        } else {
            nextBtn.hidden = false;
            finishBtn.hidden = true;
        }
    },

    selectAnswer(index) {
        this.state.answers[this.state.currentIndex] = index;
        
        // Update UI
        const options = document.querySelectorAll('.quiz-option');
        options.forEach(opt => opt.classList.remove('selected'));
        options[index].classList.add('selected');
    },

    prevQuestion() {
        if (this.state.currentIndex > 0) {
            this.state.currentIndex--;
            this.showQuestion();
        }
    },

    nextQuestion() {
        if (this.state.currentIndex < this.state.questions.length - 1) {
            this.state.currentIndex++;
            this.showQuestion();
        }
    },

    finish() {
        const unanswered = this.state.answers.filter(a => a === null).length;
        
        if (unanswered > 0) {
            if (!confirm(`Você tem ${unanswered} questão(ões) não respondida(s). Deseja finalizar mesmo assim?`)) {
                return;
            }
        }
        
        this.stopTimer();
        this.state.active = false;
        
        // Calculate results
        const results = this.calculateResults();
        
        // Save to storage
        Storage.addSimuladoResult(results);
        Storage.incrementStat('questoesResolvidas', this.state.questions.length);
        Storage.incrementStat('questoesCorretas', results.correct);
        
        // Add activity
        Storage.addActivity({
            type: 'simulado',
            title: `Simulado ${this.state.type}`,
            description: `${results.correct}/${results.total} acertos (${results.percentage}%)`,
            icon: 'fa-clipboard-check'
        });
        
        // Show results
        this.showResults(results);
    },

    calculateResults() {
        let correct = 0;
        
        this.state.questions.forEach((question, index) => {
            if (this.state.answers[index] === question.correct) {
                correct++;
            }
        });
        
        const total = this.state.questions.length;
        const wrong = total - correct;
        const percentage = Math.round((correct / total) * 100);
        
        return {
            correct,
            wrong,
            total,
            percentage,
            time: this.state.elapsedSeconds,
            timeFormatted: formatTime(this.state.elapsedSeconds),
            type: this.state.type,
            materias: this.state.materias
        };
    },

    showResults(results) {
        this.quizContainer.hidden = true;
        this.resultsContainer.hidden = false;
        
        // Update icon and title based on performance
        const icon = document.getElementById('results-icon');
        const title = document.getElementById('results-title');
        const subtitle = document.getElementById('results-subtitle');
        
        icon.className = 'results-icon';
        
        if (results.percentage >= 80) {
            icon.classList.add('success');
            icon.innerHTML = '<i class="fas fa-trophy"></i>';
            title.textContent = 'Excelente!';
            subtitle.textContent = 'Você está no caminho certo para a aprovação!';
        } else if (results.percentage >= 60) {
            icon.classList.add('warning');
            icon.innerHTML = '<i class="fas fa-star-half-alt"></i>';
            title.textContent = 'Bom trabalho!';
            subtitle.textContent = 'Continue estudando para melhorar ainda mais!';
        } else {
            icon.classList.add('error');
            icon.innerHTML = '<i class="fas fa-book-reader"></i>';
            title.textContent = 'Continue estudando!';
            subtitle.textContent = 'Revise os conteúdos e tente novamente.';
        }
        
        // Update stats
        document.getElementById('result-correct').textContent = results.correct;
        document.getElementById('result-wrong').textContent = results.wrong;
        document.getElementById('result-percentage').textContent = `${results.percentage}%`;
        document.getElementById('result-time').textContent = results.timeFormatted;
        
        // Draw chart
        this.drawResultsChart(results);
    },

    drawResultsChart(results) {
        const ctx = document.getElementById('results-chart')?.getContext('2d');
        if (!ctx) return;
        
        // Destroy existing chart if any
        if (this.resultsChart) {
            this.resultsChart.destroy();
        }
        
        this.resultsChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Acertos', 'Erros'],
                datasets: [{
                    data: [results.correct, results.wrong],
                    backgroundColor: ['#10B981', '#EF4444'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                cutout: '60%'
            }
        });
    },

    reviewAnswers() {
        Toast.info('Em breve', 'A revisão detalhada das respostas será implementada em breve!');
    },

    reset() {
        this.state = {
            active: false,
            type: 'rapido',
            materias: ['portugues'],
            questions: [],
            currentIndex: 0,
            answers: [],
            startTime: null,
            timerInterval: null,
            elapsedSeconds: 0
        };
        
        this.simuladoContainer.hidden = false;
        this.quizContainer.hidden = true;
        this.resultsContainer.hidden = true;
        
        // Reset timer display
        document.getElementById('timer-display').textContent = '00:00';
    },

    getMateriaName(key) {
        const names = {
            portugues: 'Língua Portuguesa',
            ingles: 'Língua Inglesa',
            matematica: 'Matemática',
            logica: 'Raciocínio Lógico',
            constitucional: 'Direito Constitucional',
            administrativo: 'Direito Administrativo',
            eleitoral: 'Direito Eleitoral',
            financeira: 'Matemática Financeira',
            bancarios: 'Conhecimentos Bancários',
            informatica: 'Noções de Informática',
            atualidades: 'Atualidades',
            etica: 'Ética no Serviço Público'
        };
        return names[key] || key;
    }
};

// =============================================================================
// 10. POMODORO TIMER
// =============================================================================

const PomodoroTimer = {
    state: {
        isRunning: false,
        isPaused: false,
        mode: 'work', // work, break, longBreak
        timeRemaining: CONFIG.pomodoroWork,
        sessions: 0,
        interval: null
    },

    init() {
        this.bindElements();
        this.bindEvents();
        this.loadState();
        this.updateDisplay();
    },

    bindElements() {
        this.widget = document.getElementById('pomodoro-widget');
        this.display = document.getElementById('pomodoro-display');
        this.status = document.getElementById('pomodoro-status');
        this.startBtn = document.getElementById('pomodoro-start');
        this.pauseBtn = document.getElementById('pomodoro-pause');
        this.resetBtn = document.getElementById('pomodoro-reset');
        this.minimizeBtn = document.getElementById('pomodoro-minimize');
        this.sessionsDisplay = document.getElementById('pomodoro-sessions');
    },

    bindEvents() {
        this.startBtn?.addEventListener('click', () => this.start());
        this.pauseBtn?.addEventListener('click', () => this.pause());
        this.resetBtn?.addEventListener('click', () => this.reset());
        this.minimizeBtn?.addEventListener('click', () => this.toggleMinimize());
    },

    loadState() {
        const data = Storage.getData();
        this.state.sessions = data.stats.pomodoroSessions || 0;
    },

    start() {
        if (this.state.isRunning) return;
        
        this.state.isRunning = true;
        this.state.isPaused = false;
        
        this.startBtn.hidden = true;
        this.pauseBtn.hidden = false;
        
        this.state.interval = setInterval(() => this.tick(), 1000);
        
        Toast.info('Pomodoro', 'Timer iniciado! Mantenha o foco!');
    },

    pause() {
        if (!this.state.isRunning) return;
        
        this.state.isRunning = false;
        this.state.isPaused = true;
        
        this.startBtn.hidden = false;
        this.pauseBtn.hidden = true;
        
        clearInterval(this.state.interval);
    },

    reset() {
        this.state.isRunning = false;
        this.state.isPaused = false;
        this.state.mode = 'work';
        this.state.timeRemaining = CONFIG.pomodoroWork;
        
        this.startBtn.hidden = false;
        this.pauseBtn.hidden = true;
        
        clearInterval(this.state.interval);
        this.updateDisplay();
    },

    tick() {
        this.state.timeRemaining--;
        this.updateDisplay();
        
        if (this.state.timeRemaining <= 0) {
            this.complete();
        }
    },

    complete() {
        clearInterval(this.state.interval);
        this.state.isRunning = false;
        
        // Play sound or notification
        this.notify();
        
        if (this.state.mode === 'work') {
            this.state.sessions++;
            Storage.updateStats('pomodoroSessions', this.state.sessions);
            this.sessionsDisplay.textContent = this.state.sessions;
            
            // Determine break type
            if (this.state.sessions % 4 === 0) {
                this.state.mode = 'longBreak';
                this.state.timeRemaining = CONFIG.pomodoroLongBreak;
                Toast.success('Pausa Longa!', 'Você completou 4 sessões! Faça uma pausa de 15 minutos.');
            } else {
                this.state.mode = 'break';
                this.state.timeRemaining = CONFIG.pomodoroBreak;
                Toast.success('Pausa!', 'Bom trabalho! Faça uma pausa de 5 minutos.');
            }
        } else {
            this.state.mode = 'work';
            this.state.timeRemaining = CONFIG.pomodoroWork;
            Toast.info('Hora de Focar!', 'A pausa acabou. Vamos voltar aos estudos!');
        }
        
        this.startBtn.hidden = false;
        this.pauseBtn.hidden = true;
        this.updateDisplay();
    },

    notify() {
        // Browser notification
        if (Notification.permission === 'granted') {
            new Notification('ConcursaJá - Pomodoro', {
                body: this.state.mode === 'work' ? 'Sessão completa! Hora da pausa.' : 'Pausa encerrada! Vamos estudar.',
                icon: '📚'
            });
        }
        
        // Audio notification (optional)
        try {
            const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');
            audio.volume = 0.5;
            audio.play().catch(() => {});
        } catch (e) {}
    },

    updateDisplay() {
        this.display.textContent = formatTime(this.state.timeRemaining);
        this.sessionsDisplay.textContent = this.state.sessions;
        
        const statusTexts = {
            work: 'Foco',
            break: 'Pausa',
            longBreak: 'Pausa Longa'
        };
        this.status.textContent = statusTexts[this.state.mode];
    },

    toggleMinimize() {
        this.widget.classList.toggle('minimized');
    }
};

// =============================================================================
// 11. PROGRESS CHARTS
// =============================================================================

const ProgressCharts = {
    materiasChart: null,
    evolucaoChart: null,

    init() {
        this.drawMateriasChart();
        this.drawEvolucaoChart();
    },

    drawMateriasChart() {
        const ctx = document.getElementById('chart-materias')?.getContext('2d');
        if (!ctx) return;
        
        const data = Storage.getData();
        
        // Calculate performance per subject based on simulado history
        const materiaPerformance = {};
        const materiaCount = {};
        
        data.simuladoHistory?.forEach(result => {
            result.materias?.forEach(materia => {
                if (!materiaPerformance[materia]) {
                    materiaPerformance[materia] = 0;
                    materiaCount[materia] = 0;
                }
                materiaPerformance[materia] += result.percentage;
                materiaCount[materia]++;
            });
        });
        
        // Calculate averages
        const labels = [];
        const values = [];
        const colors = [
            '#3B82F6', '#8B5CF6', '#10B981', '#F97316',
            '#EF4444', '#14B8A6', '#6366F1', '#EAB308',
            '#06B6D4', '#EC4899', '#84CC16', '#F59E0B'
        ];
        
        const materiaNames = {
            portugues: 'Português',
            matematica: 'Matemática',
            logica: 'R. Lógico',
            constitucional: 'D. Const.',
            administrativo: 'D. Admin.',
            informatica: 'Informática'
        };
        
        Object.keys(materiaPerformance).forEach(materia => {
            const avg = Math.round(materiaPerformance[materia] / materiaCount[materia]);
            labels.push(materiaNames[materia] || materia);
            values.push(avg);
        });
        
        // Default data if no history
        if (labels.length === 0) {
            ['Português', 'Matemática', 'R. Lógico', 'D. Const.', 'D. Admin.', 'Informática'].forEach(name => {
                labels.push(name);
                values.push(0);
            });
        }
        
        if (this.materiasChart) {
            this.materiasChart.destroy();
        }
        
        this.materiasChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Desempenho (%)',
                    data: values,
                    backgroundColor: colors.slice(0, labels.length),
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: value => value + '%'
                        }
                    }
                }
            }
        });
    },

    drawEvolucaoChart() {
        const ctx = document.getElementById('chart-evolucao')?.getContext('2d');
        if (!ctx) return;
        
        const data = Storage.getData();
        
        // Get last 7 days of activity
        const days = [];
        const questoes = [];
        const acertos = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
            days.push(dayName);
            
            // Count questions and correct answers for this day
            const dayStart = new Date(date.setHours(0, 0, 0, 0)).getTime();
            const dayEnd = new Date(date.setHours(23, 59, 59, 999)).getTime();
            
            let dayQuestoes = 0;
            let dayAcertos = 0;
            
            data.simuladoHistory?.forEach(result => {
                if (result.timestamp >= dayStart && result.timestamp <= dayEnd) {
                    dayQuestoes += result.total || 0;
                    dayAcertos += result.correct || 0;
                }
            });
            
            questoes.push(dayQuestoes);
            acertos.push(dayAcertos);
        }
        
        if (this.evolucaoChart) {
            this.evolucaoChart.destroy();
        }
        
        this.evolucaoChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [
                    {
                        label: 'Questões',
                        data: questoes,
                        borderColor: '#3B82F6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Acertos',
                        data: acertos,
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
};

// =============================================================================
// 12. PROGRESS STATS
// =============================================================================

const ProgressStats = {
    init() {
        this.updateStats();
        this.updateActivities();
        this.updateProgressBars();
    },

    updateStats() {
        const data = Storage.getData();
        
        document.getElementById('stat-aulas').textContent = data.stats.aulasAssistidas || 0;
        document.getElementById('stat-questoes').textContent = data.stats.questoesResolvidas || 0;
        
        const aproveitamento = data.stats.questoesResolvidas > 0
            ? Math.round((data.stats.questoesCorretas / data.stats.questoesResolvidas) * 100)
            : 0;
        document.getElementById('stat-aproveitamento').textContent = `${aproveitamento}%`;
        
        // Check and update streak
        const streak = Storage.checkStreak();
        document.getElementById('stat-streak').textContent = streak;
    },

    updateActivities() {
        const data = Storage.getData();
        const list = document.getElementById('activity-list');
        
        if (!list) return;
        
        if (data.activities.length === 0) {
            list.innerHTML = `
                <li class="activity-item activity-item--empty">
                    <i class="fas fa-info-circle"></i>
                    <span>Nenhuma atividade registrada ainda. Comece a estudar!</span>
                </li>
            `;
            return;
        }
        
        list.innerHTML = data.activities.slice(0, 10).map(activity => {
            const date = new Date(activity.timestamp);
            const timeAgo = this.getTimeAgo(date);
            
            return `
                <li class="activity-item">
                    <div class="activity-item__icon">
                        <i class="fas ${activity.icon || 'fa-check'}"></i>
                    </div>
                    <div class="activity-item__content">
                        <div class="activity-item__title">${activity.title}</div>
                        <div class="activity-item__time">${activity.description} • ${timeAgo}</div>
                    </div>
                </li>
            `;
        }).join('');
    },

    updateProgressBars() {
        const data = Storage.getData();
        
        document.querySelectorAll('.progress-bar__fill[data-materia]').forEach(bar => {
            const materia = bar.dataset.materia;
            const progress = data.progress[materia] || 0;
            bar.style.setProperty('--progress', `${progress}%`);
            
            const text = bar.closest('.materia-card__progress')?.querySelector('.progress-text');
            if (text) {
                text.textContent = `${progress}% concluído`;
            }
        });
    },

    getTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        
        const intervals = {
            ano: 31536000,
            mês: 2592000,
            semana: 604800,
            dia: 86400,
            hora: 3600,
            minuto: 60
        };
        
        for (const [name, secondsInInterval] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInInterval);
            if (interval >= 1) {
                return `há ${interval} ${name}${interval > 1 ? (name === 'mês' ? 'es' : 's') : ''}`;
            }
        }
        
        return 'agora mesmo';
    }
};

// =============================================================================
// 13. AOS (Animate on Scroll)
// =============================================================================

const AOSInit = {
    init() {
        const elements = document.querySelectorAll('[data-aos]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.aosDelay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('aos-animate');
                    }, parseInt(delay));
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(el => observer.observe(el));
    }
};

// =============================================================================
// 14. BACK TO TOP
// =============================================================================

const BackToTop = {
    init() {
        const button = document.getElementById('back-to-top');
        
        button?.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
};

// =============================================================================
// 15. NOTIFICATION PERMISSION
// =============================================================================

const NotificationManager = {
    init() {
        if ('Notification' in window && Notification.permission === 'default') {
            // Request permission after user interaction
            document.addEventListener('click', () => {
                Notification.requestPermission();
            }, { once: true });
        }
    }
};

// =============================================================================
// 16. INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    ThemeManager.init();
    Navigation.init();
    CounterAnimation.init();
    MateriasFilter.init();
    SimuladoSystem.init();
    PomodoroTimer.init();
    ProgressCharts.init();
    ProgressStats.init();
    AOSInit.init();
    BackToTop.init();
    NotificationManager.init();
    
    // Theme toggle button
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
        ThemeManager.toggle();
    });
    
    // Video buttons (placeholder)
    document.querySelectorAll('[data-video]').forEach(btn => {
        btn.addEventListener('click', () => {
            Toast.info('Em breve', 'As videoaulas serão disponibilizadas em breve!');
        });
    });
    
    // Materia links (placeholder)
    document.querySelectorAll('.materia-card__link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const materia = link.dataset.materia;
            Toast.info('Em breve', `O conteúdo de ${SimuladoSystem.getMateriaName(materia)} será disponibilizado em breve!`);
        });
    });
    
    console.log('🎓 ConcursaJá - Plataforma inicializada com sucesso!');
});

// Service Worker Registration (for PWA support)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker registration would go here
        // navigator.serviceWorker.register('/sw.js');
    });
}
