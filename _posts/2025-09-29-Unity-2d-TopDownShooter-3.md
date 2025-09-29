---
title: Unity 2D | TopDownShooter 03
date: 2025-09-29 22:35:42 +0900
categories: [Project, Project\Unity]
tags: [Unity, C-sharp, 2D, Project History]
author: "rniman"                            # for single entry
# or
# authors: [<author1_id>, <author2_id>]   # for multiple entries
description: "Unity 2D TopDownShooter 개발 기록 - 3편"
math: true
comments: false # 댓글 기능
---

Unity 2D 슈팅 게임 개발 프로젝트의 세 번째 단계로, 게임 매니저와 UI 시스템, 아이템 시스템을 구현했다. 싱글톤 패턴과 이벤트 시스템을 활용한 게임 상태 관리에 대해 정리한다.

---

## 프로젝트 개요

**프로젝트명:** TopDownShooter  
**목적:** Unity 2D 게임 개발 학습  
**장르:** 탑다운 뷰 슈팅 게임

---

## 구현 내용 개요

이번 단계에서는 게임의 전체적인 흐름을 관리하는 시스템들을 구현했다. 게임 매니저를 통한 중앙 집중식 관리, UI 시스템을 통한 사용자 인터페이스, 그리고 아이템 시스템을 통한 게임플레이 다양성을 추가했다.

---

## 게임 매니저(GameManager) 시스템

### 싱글톤 패턴 구현

게임 전반의 상태를 관리하는 중심 역할을 담당하는 GameManager를 싱글톤 패턴으로 구현했다.

**GameManager 구성:**
- **빈 오브젝트** 생성 후 "GameManager"로 명명
- **GameManager 스크립트** 추가
- **AudioSource** 컴포넌트로 배경음악 관리

**싱글톤 패턴 구현:**

```csharp
public class GameManager : MonoBehaviour
{
    // 외부에서 읽기만 가능, 쓰기는 내부에서만
    public static GameManager Instance { get; private set; }
    
    private void Awake()
    {
        // 하나의 인스턴스만 존재하도록 보장
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject); // 씬 전환 시에도 유지
        }
        else
        {
            Destroy(gameObject); // 중복 인스턴스 제거
        }
    }
}
```

> **싱글톤 패턴의 장점:** 전역 접근 가능, 메모리 효율성, 상태 일관성 보장. 하지만 과도한 사용은 코드 결합도를 높일 수 있으므로 게임 매니저, 사운드 매니저 등 핵심 시스템에만 적용하는 것이 좋다.
{: .prompt-tip }

---

## UI 시스템 구현

### Canvas 설정 및 구조

반응형 UI를 위한 Canvas 설정을 진행했다.

**Canvas 기본 설정:**
- **UI Scale Mode**: Scale With Screen Size
- **Reference Resolution**: 1920 x 1080
- **다양한 해상도에서 일관된 UI 제공**

### UI 계층 구조

```
Canvas
├── GameUI (빈 오브젝트)
│   ├── ScoreText (TextMeshPro)
│   ├── WaveText (TextMeshPro)
│   ├── HealthBar (Slider)
│   └── HealthText (TextMeshPro)
├── PauseUI (빈 오브젝트, 초기 비활성화)
│   ├── PausePanel (Image - 반투명 배경)
│   ├── ResumeButton (Button)
│   ├── RestartButton (Button)
│   └── QuitButton (Button)
└── GameOverUI (빈 오브젝트, 초기 비활성화)
    ├── GameOverPanel (Image)
    ├── FinalScoreText (TextMeshPro)
    ├── HighScoreText (TextMeshPro)
    ├── NewHighScoreText (TextMeshPro)
    ├── PlayAgainButton (Button)
    └── MainMenuButton (Button)
```

이러한 계층적 구조를 통해 게임 상태에 따른 UI 전환을 효율적으로 관리할 수 있다.

**UIManager 스크립트 추가:**
각 UI 그룹을 독립적으로 관리하고, 게임 상태에 따라 적절한 UI를 표시하는 역할을 담당한다.

---

## 아이템 시스템 구현

### HealthItem 구성

플레이어의 체력을 회복시키는 아이템을 구현했다.

**HealthItem 오브젝트:**
- **빈 오브젝트** 생성 후 "HealthItem"으로 명명
- **CircleCollider2D**: Is Trigger = true (충돌 감지)
- **Sprite Renderer**: 아이템 시각화
- **HealthItem 스크립트**: 아이템 기능 구현
- **Tag**: "HealthItem" 설정
- **프리팹으로 저장**하여 재사용성 확보

### ItemSpawner 시스템

아이템의 생성과 관리를 담당하는 스포너 시스템을 구현했다.

**ItemSpawner 구성:**
- **빈 오브젝트** 생성 후 "ItemSpawner"로 명명
- **ItemSpawner 스크립트** 추가
- **아이템 프리팹 배열** 할당으로 다양한 아이템 관리

---

## 핵심 C# 개념 활용

### 프로퍼티(Property) 문법

C#의 자동 프로퍼티 문법은 데이터 접근을 제어한다.

```csharp
public class GameData 
{
    // 완전 공개 - 외부에서 읽기/쓰기 모두 가능
    public int Lives { get; set; } = 3;
    
    // 읽기만 공개 - 외부에서는 읽기만, 클래스 내부에서만 쓰기 가능
    public int Score { get; private set; } = 0;
    public int MaxHealth { get; private set; } = 100;
    
    // 완전 비공개 - 외부 접근 불가
    private int SecretCode { get; set; } = 1234;
    
    // 점수 추가 메서드 (내부에서만 Score 변경 가능)
    public void AddScore(int points)
    {
        Score += points;
    }
}
```

**접근 제한자별 활용:**

| 접근 수준   | 문법                    | 활용 예시                |
| ----------- | ----------------------- | ------------------------ |
| 완전 공개   | `{ get; set; }`         | 설정값, 플레이어 입력    |
| 읽기만 공개 | `{ get; private set; }` | 점수, 체력, 상태값       |
| 완전 비공개 | `private { get; set; }` | 내부 계산값, 임시 데이터 |

### FindFirstObjectByType<T>() 함수

Unity 최신 버전에서 권장하는 오브젝트 검색 방법이다.

```csharp
// 권장 방법 (Unity 2023.1+)
Player player = FindFirstObjectByType<Player>();
GameManager gameManager = FindFirstObjectByType<GameManager>();

// 대안 방법
UIManager uiManager = FindAnyObjectByType<UIManager>(); // 빠른 검색, 정렬 없음
```

> **성능 최적화 팁:** FindFirstObjectByType은 씬에서 해당 타입의 첫 번째 오브젝트를 반환한다. FindAnyObjectByType은 더 빠르지만 순서를 보장하지 않으므로, 특정 순서가 중요하지 않은 경우 사용하면 좋다.
{: .prompt-tip }

### PlayerPrefs를 이용한 데이터 저장

Unity에서 제공하는 간단한 영구 데이터 저장 시스템이다.

**데이터 저장:**

```csharp
public class GameData : MonoBehaviour 
{
    void SaveGameData()
    {
        // 정수 저장
        PlayerPrefs.SetInt("PlayerLevel", 5);
        PlayerPrefs.SetInt("HighScore", 1500);
        
        // 실수 저장  
        PlayerPrefs.SetFloat("Volume", 0.8f);
        PlayerPrefs.SetFloat("PlayerPosX", 10.5f);
        
        // 문자열 저장
        PlayerPrefs.SetString("PlayerName", "김유니티");
        PlayerPrefs.SetString("LastPlayDate", System.DateTime.Now.ToString());
        
        // 중요: 실제로 디스크에 저장
        PlayerPrefs.Save();
    }
}
```

**데이터 불러오기:**

```csharp
public class GameManager : MonoBehaviour 
{
    public int playerLevel;
    public int highScore;
    public float volume;
    public string playerName;
    
    void LoadGameData()
    {
        // 기본값을 설정하여 안전하게 불러오기
        playerLevel = PlayerPrefs.GetInt("PlayerLevel", 1);        // 없으면 기본값 1
        highScore = PlayerPrefs.GetInt("HighScore", 0);           // 없으면 기본값 0
        volume = PlayerPrefs.GetFloat("Volume", 1.0f);            // 없으면 기본값 1.0
        playerName = PlayerPrefs.GetString("PlayerName", "Player"); // 없으면 "Player"
        
        Debug.Log($"불러온 데이터 - 레벨: {playerLevel}, 최고점수: {highScore}");
    }
}
```

---

## 고급 C# 개념

### Null 조건부 연산자 (?.)

안전한 null 처리를 위한 C# 문법이다.

```csharp
// 전통적인 방법
if (OnHealthChanged != null)
{
    OnHealthChanged.Invoke(currentHealth);
}

// Null 조건부 연산자 사용 (권장)
OnHealthChanged?.Invoke(currentHealth);

// 체이닝도 가능
player?.GetComponent<PlayerHealth>()?.TakeDamage(10);
```

### C# 이벤트 시스템

게임 오브젝트 간의 느슨한 결합을 위한 이벤트 시스템을 구현했다.

**이벤트 선언 및 발생:**

```csharp
public class PlayerHealth : MonoBehaviour 
{
    // 이벤트 선언
    public event Action OnPlayerDeath;                    // 매개변수 없음
    public event Action<int> OnHealthChanged;             // int 매개변수
    public event Action<int, Vector3> OnDamageReceived;   // 복수 매개변수
    
    private int currentHealth = 100;
    
    public void TakeDamage(int damage)
    {
        currentHealth -= damage;
        
        // 이벤트 발생
        OnHealthChanged?.Invoke(currentHealth);
        OnDamageReceived?.Invoke(damage, transform.position);
        
        if (currentHealth <= 0)
        {
            OnPlayerDeath?.Invoke();
        }
    }
}
```

**이벤트 구독 및 처리:**

```csharp
public class UIManager : MonoBehaviour 
{
    private PlayerHealth playerHealth;
    
    void Start()
    {
        playerHealth = FindFirstObjectByType<PlayerHealth>();
        
        // 이벤트 구독
        playerHealth.OnPlayerDeath += HandlePlayerDeath;
        playerHealth.OnHealthChanged += UpdateHealthUI;
        playerHealth.OnDamageReceived += ShowDamageEffect;
    }
    
    // 이벤트 핸들러 함수들
    private void HandlePlayerDeath()
    {
        Debug.Log("플레이어 사망 - 게임오버 UI 표시");
        ShowGameOverUI();
    }
    
    private void UpdateHealthUI(int newHealth)
    {
        healthBar.value = newHealth / 100f;
        healthText.text = $"HP: {newHealth}";
    }
    
    private void ShowDamageEffect(int damage, Vector3 position)
    {
        // 데미지 텍스트 표시 등
        SpawnDamageText(damage, position);
    }
    
    void OnDestroy()
    {
        // 메모리 누수 방지를 위한 구독 해제
        if (playerHealth != null)
        {
            playerHealth.OnPlayerDeath -= HandlePlayerDeath;
            playerHealth.OnHealthChanged -= UpdateHealthUI;
            playerHealth.OnDamageReceived -= ShowDamageEffect;
        }
    }
}
```

> **이벤트 시스템의 장점:** 코드 결합도 감소, 유지보수성 향상, 확장성 증대. 하나의 이벤트에 여러 핸들러를 등록할 수 있어 복잡한 게임 로직을 깔끔하게 관리할 수 있다.
{: .prompt-info }

### Time.timeScale을 이용한 시간 제어

게임 일시정지 및 시간 조작 기능을 구현했다.

```csharp
public class GameManager : MonoBehaviour 
{
    private bool isPaused = false;
    
    public void PauseGame()
    {
        isPaused = true;
        Time.timeScale = 0f;    // 게임 시간 정지
        ShowPauseUI();
    }
    
    public void ResumeGame()
    {
        isPaused = false;
        Time.timeScale = 1f;    // 정상 속도로 복원
        HidePauseUI();
    }
    
    public void SlowMotion(float duration)
    {
        StartCoroutine(SlowMotionEffect(duration));
    }
    
    private IEnumerator SlowMotionEffect(float duration)
    {
        Time.timeScale = 0.3f;  // 30% 속도로 감소
        
        // 실제 시간으로 대기 (timeScale 영향 없음)
        yield return new WaitForSecondsRealtime(duration);
        
        Time.timeScale = 1f;    // 정상 속도 복원
    }
}
```

**timeScale 영향받는 요소 vs 영향받지 않는 요소:**

| 영향 받음                           | 영향 받지 않음                              |
| ----------------------------------- | ------------------------------------------- |
| `Time.deltaTime`                    | `Time.unscaledDeltaTime`                    |
| `Rigidbody.velocity`                | `Time.realtimeSinceStartup`                 |
| `Animation`                         | `yield return new WaitForSecondsRealtime()` |
| `Particle System`                   | `Input 시스템`                              |
| `yield return new WaitForSeconds()` | `UI 애니메이션 (Unscaled Time 설정)`        |

> **주의사항:** Time.timeScale을 0으로 설정하면 대부분의 게임 로직이 정지되지만, 일시정지 메뉴의 버튼은 여전히 작동해야 한다. UI는 Unscaled Time으로 설정하거나, 입력 처리는 Update에서 계속 처리되도록 해야 한다.
{: .prompt-warning }

---

## 다음 단계 계획

1. **사운드 시스템 확장** - 효과음과 배경음악 관리 시스템
2. **파워업 아이템** - 다양한 종류의 아이템과 효과 구현
3. **파티클 효과** - 시각적 임팩트 강화
4. **최적화 작업** - 오브젝트 풀링과 성능 개선

이번 편에서는 게임의 전체적인 흐름을 관리하는 시스템들을 구현했다. 특히 싱글톤 패턴과 이벤트 시스템을 통한 느슨한 결합 설계는 향후 기능 확장에 큰 도움이 될 것이다.
