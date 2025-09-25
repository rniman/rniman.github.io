---
title: Unity 2D | TopDownShooter 02
date: 2025-09-26 00:35:42 +0900
categories: [Project, Project\Unity]
tags: [Unity, C-sharp, 2D, Project History]
author: "rniman"                            # for single entry
# or
# authors: [<author1_id>, <author2_id>]   # for multiple entries
description: "Unity 2D TopDownShooter 개발 기록 - 2편"
math: true
comments: false # 댓글 기능
---

Unity 2D 슈팅 게임 개발 프로젝트의 두 번째 단계로, 적 캐릭터와 스포너 시스템 구현에 대한 기록이다. AI 시스템과 디버깅 도구 활용법을 중심으로 정리했다.

---

## 프로젝트 개요

**프로젝트명:** TopDownShooter  
**목적:** Unity 2D 게임 개발 학습  
**장르:** 탑다운 뷰 슈팅 게임

---

## 구현 내용 개요

이번 단계에서는 게임의 핵심 요소인 적 캐릭터와 적 생성 시스템을 구현했다. 기본적인 AI 행동 패턴과 체력 시스템, 그리고 효율적인 디버깅 도구 활용법을 학습했다.

---

## 적 캐릭터(Enemy) 구현

### 기본 구조 설계

적 캐릭터는 플레이어와 상호작용할 수 있는 독립적인 개체로 설계했다.

**Enemy 오브젝트 구성:**
- **Rigidbody 2D**: Gravity Scale = 0, Freeze Rotation Z = true
- **CircleCollider 2D**: Is Trigger = true (충돌 감지용)
- **Sprite Renderer**: 적 캐릭터 시각화
- **EnemyAI**: AI 행동 제어 스크립트
- **EnemyHealth**: 체력 시스템 스크립트
- **Tag**: 'Enemy'로 설정

> **프리팹 생성:** 완성된 Enemy 오브젝트는 프리팹으로 저장하여 재사용성을 높였다. 이를 통해 다양한 종류의 적을 효율적으로 관리할 수 있다.
{: .prompt-tip }

### Rigidbody 2D 설정 심화

**Freeze Rotation Z = true 설정 이유:**

2D 게임에서 적 캐릭터가 의도하지 않은 회전을 방지하기 위해 Z축 회전을 고정했다. 이를 통해 예측 가능한 움직임을 구현할 수 있다.

**Freeze 설정 활용 가이드:**

| 설정                    | 적용 대상                     | 목적                 |
| ----------------------- | ----------------------------- | -------------------- |
| Freeze Rotation = true  | 플레이어, 총알, 적 캐릭터     | 의도된 회전만 허용   |
| Freeze Rotation = false | 파편, 잔해, 굴러가는 오브젝트 | 자연스러운 물리 효과 |

---

## 적 스포너(EnemySpawner) 시스템

### 스포너 구조

**EnemySpawner 오브젝트:**
- **빈 오브젝트** 생성 후 EnemySpawner로 명명
- **EnemySpawner 스크립트** 추가
- **Enemy Prefabs 배열**: 다양한 적 프리팹 할당 가능

이 구조를 통해 여러 종류의 적을 랜덤하게 스폰할 수 있는 확장성 있는 시스템을 구축했다.

---

## 핵심 개발 개념

### Update()와 FixedUpdate() 차이점

Unity의 생명주기 함수를 올바르게 사용하는 것이 게임 성능과 안정성에 중요하다.

**FixedUpdate() 특징:**
- **실행 주기**: 고정된 시간 간격 (기본 50Hz)
- **용도**: 물리 연산, Rigidbody 조작
- **안정성**: 프레임레이트와 무관하게 일정한 물리 시뮬레이션

**Update() 특징:**
- **실행 주기**: 가변 프레임레이트에 따라 실행
- **용도**: 입력 처리, UI 업데이트, 일반적인 게임 로직
- **반응성**: 빠른 입력 응답 가능

**권장 사용법:**

```csharp
// FixedUpdate에서 처리할 내용
void FixedUpdate()
{
    // 물리 기반 이동
    rb.velocity = moveDirection * moveSpeed;
    
    // AddForce 사용
    rb.AddForce(forceDirection);
    
    // 물리 충돌 관련 계산
    Physics2D.OverlapCircle(transform.position, detectionRadius);
}

// Update에서 처리할 내용
void Update()
{
    // 입력 감지
    moveInput = Input.GetAxis("Horizontal");
    
    // 거리 계산
    distanceToPlayer = Vector3.Distance(transform.position, player.position);
    
    // Transform 직접 조작
    transform.position += moveDirection * moveSpeed * Time.deltaTime;
}
```

> **중요한 원칙:** 물리 기반 이동은 반드시 FixedUpdate에서, 입력 처리는 Update에서 수행해야 한다. 이를 지키지 않으면 프레임레이트에 따른 불일치 문제가 발생할 수 있다.
{: .prompt-warning }

### Tag 시스템 활용

Unity의 Tag 시스템을 통해 오브젝트 간 효율적인 상호작용을 구현했다.

**Tag 생성 방법:**
1. Inspector의 Tag 드롭다운 클릭
2. "Add Tag" 선택
3. 새로운 태그 추가 (예: "Enemy")

**실제 활용 예시:**

```csharp
void OnTriggerEnter2D(Collider2D other)
{
    // 플레이어와 충돌 시 처리
    if (other.CompareTag("Player"))
    {
        Debug.Log("플레이어와 충돌! 데미지 적용");
        
        // 플레이어 체력 감소 로직
        PlayerHealth playerHealth = other.GetComponent<PlayerHealth>();
        if (playerHealth != null)
        {
            playerHealth.TakeDamage(damageAmount);
        }
    }
    
    // 총알과 충돌 시 처리
    if (other.CompareTag("Bullet"))
    {
        TakeDamage(other.GetComponent<BulletController>().damage);
        Destroy(other.gameObject);
    }
}
```

### OnDrawGizmosSelected() 함수

Unity Scene 뷰에서 시각적 디버깅을 위한 강력한 도구다.

**주요 특징:**
- GameObject가 선택되었을 때만 실행
- 런타임 중에만 표시하여 성능 최적화
- AI 행동 범위, 충돌 영역 등을 시각적으로 확인 가능

**실제 구현 예시:**

```csharp
void OnDrawGizmosSelected()
{
    // 런타임이 아닐 때는 실행하지 않음 (성능 최적화)
    if (!Application.isPlaying) 
    {
        return; 
    }

    // 적 감지 범위 표시 (노란색)
    Gizmos.color = Color.yellow;
    Gizmos.DrawWireSphere(transform.position, detectionRange);
    
    // 공격 정지 거리 표시 (빨간색)
    Gizmos.color = Color.red;
    Gizmos.DrawWireSphere(transform.position, stopDistance);
    
    // 플레이어를 향한 방향 표시 (초록색)
    if (player != null)
    {
        Gizmos.color = Color.green;
        Gizmos.DrawLine(transform.position, player.position);
    }
}
```

**Gizmo 관련 함수들:**

| 함수                   | 실행 시점         | 용도                  |
| ---------------------- | ----------------- | --------------------- |
| `OnDrawGizmos`         | 항상 표시         | 중요한 정보 상시 표시 |
| `OnDrawGizmosSelected` | 선택 시만 표시    | 상세 디버깅 정보      |
| `OnValidate`           | Inspector 변경 시 | 실시간 값 검증        |

### Coroutine 기초 개념

Unity에서 시간 기반 작업을 처리하는 핵심 도구다.

**Coroutine의 특징:**
- 함수 실행을 중간에 일시정지 가능
- 다음 프레임에 이어서 실행 가능
- Unity의 싱글 스레드 환경에서 비동기적 처리 제공
- 메모리 효율적인 시간 기반 작업 처리

**기본 사용 패턴:**

```csharp
// 코루틴 시작
StartCoroutine(SpawnEnemies());

// 코루틴 함수 예시
IEnumerator SpawnEnemies()
{
    while (gameIsRunning)
    {
        // 적 생성
        SpawnRandomEnemy();
        
        // 다음 스폰까지 대기
        yield return new WaitForSeconds(spawnInterval);
    }
}

// 조건부 대기 예시
IEnumerator WaitForPlayerInRange()
{
    yield return new WaitUntil(() => 
        Vector3.Distance(transform.position, player.position) < detectionRange
    );
    
    // 플레이어가 범위에 들어왔을 때 실행할 코드
    StartAttack();
}
```

> **참고**: 코루틴의 추가 예시들이 필요하다면 [Unity 코루틴 가이드]({% post_url 2025-09-26-Unity-Coroutine %})를 먼저 읽어보자.
{: .prompt-info }

---

## 다음 단계 계획

1. **충돌 시스템 완성** - 총알과 적의 상호작용 구현
2. **적 AI 고도화** - 다양한 행동 패턴 추가
3. **파티클 시스템** - 시각적 효과 강화
4. **사운드 시스템** - 게임 몰입도 향상

이번 편에서는 적 캐릭터 시스템의 기초를 구축하고, Unity의 핵심 개념들을 실제 게임 개발에 적용하는 방법을 학습했다. 특히 디버깅 도구의 활용은 앞으로의 개발 과정에서 매우 유용할 것이다.
