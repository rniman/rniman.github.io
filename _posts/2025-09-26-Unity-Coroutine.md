---
title: Unity | Coroutine 가이드
date: 2025-09-26 00:25:27 +0900
categories: [Tools, Tools\Unity]
tags: [Unity, C-sharp, Coroutine, Note, Study]
author: "rniman"                            # for single entry
# or
# authors: [<author1_id>, <author2_id>]   # for multiple entries
description: "Unity Coroutine 가이드"
math: true
comments: false # 댓글 기능
---

Unity에서 코루틴(Coroutine)은 게임 개발에 있어 필수적인 기능 중 하나이다. 시간 기반 작업과 단계적 처리를 우아하게 해결할 수 있는 강력한 도구로, 많은 개발자들이 활용하고 있다.

---

## 코루틴이란?

### 기본 개념

코루틴은 **함수 실행을 중간에 멈추고 다음 프레임에 이어서 실행할 수 있는 기능**이다. 이는 Unity의 싱글 스레드 환경에서 비동기적 처리를 가능하게 하며, 특히 시간 기반 작업이나 단계적 처리에 매우 유용하다.

> 코루틴을 사용하면 복잡한 콜백 구조 없이도 직관적이고 읽기 쉬운 코드를 작성할 수 있다.
{: .prompt-tip }

---

## 코루틴 기본 문법

### 코루틴 선언과 실행

코루틴을 사용하기 위해서는 먼저 `System.Collections` 네임스페이스를 추가해야 한다. 코루틴 함수는 `IEnumerator`를 반환하며, `yield return` 문을 통해 실행을 일시 정지할 수 있다.

```csharp
using System.Collections; // IEnumerator를 사용하기 위해 필요하다.

public class Enemy : MonoBehaviour
{
    // 코루틴 함수 선언 (IEnumerator 반환)
    IEnumerator HitFlash()
    {
        // 코루틴 내용
        yield return null; // 한 프레임 대기
    }

    void TakeDamage(int damage)
    {
        // 코루틴 실행
        StartCoroutine(HitFlash());
    }
}
```

---

## 다양한 대기 방법

코루틴에서는 여러 가지 방법으로 실행을 일시 정지할 수 있다. 각각의 방법은 서로 다른 상황에 적합하다.

### 시간 대기

`WaitForSeconds`를 사용하여 지정된 시간 동안 대기할 수 있다.

```csharp
IEnumerator HitFlash()
{
    // 색상 변경
    spriteRenderer.color = hitColor;

    // 0.1초 대기
    yield return new WaitForSeconds(0.1f);

    // 원래 색상으로 복원
    spriteRenderer.color = originalColor;
}
```

### 프레임 대기

`yield return null`을 사용하면 다음 프레임까지 대기한다. 이는 매 프레임마다 실행해야 하는 작업에 유용하다.

```csharp
IEnumerator SmoothMovement()
{
    for (int i = 0; i < 60; i++) // 60프레임 동안
    {
        transform.position += Vector3.right * 0.1f;
        yield return null; // 다음 프레임까지 대기
    }
}
```

### 조건 대기

`WaitUntil`을 사용하여 특정 조건이 만족될 때까지 대기할 수 있다.

```csharp
IEnumerator WaitForPlayerNear()
{
    // 플레이어가 가까워질 때까지 대기
    yield return new WaitUntil(() =>
        Vector2.Distance(transform.position, player.position) < 3f
    );

    Debug.Log("플레이어가 근처에 왔습니다!");
}
```

---

## 실전 구현 예시

### 피격 효과 시스템

실제 게임에서 사용할 수 있는 피격 효과를 예제를 구현해보자. 이 예시는 중복 실행 방지와 예외 처리까지 고려한 코드이다.

```csharp
public class EnemyHealth : MonoBehaviour
{
    [Header("Hit Effect")]
    public float hitFlashDuration = 0.1f;
    public Color hitColor = Color.red;
    private SpriteRenderer spriteRenderer;
    private Color originalColor;
    private bool isFlashing = false;

    void Awake()
    {
        spriteRenderer = GetComponent<SpriteRenderer>();
        if (spriteRenderer != null)
        {
            originalColor = spriteRenderer.color;
        }
    }

    public void TakeDamage(int damage)
    {
        currentHealth -= damage;

        // 피격 효과 (중복 실행 방지)
        if (spriteRenderer != null && !isFlashing)
        {
            StartCoroutine(HitFlash());
        }

        if (currentHealth <= 0)
        {
            Die();
        }
    }

    IEnumerator HitFlash()
    {
        isFlashing = true;

        // 빨간색으로 변경
        spriteRenderer.color = hitColor;

        // 설정된 시간만큼 대기
        yield return new WaitForSeconds(hitFlashDuration);

        // 원래 색상으로 복원
        spriteRenderer.color = originalColor;

        isFlashing = false;
    }
}
```

---

## 추가 코루틴 활용법

### 깜빡이는 효과 구현

여러 번 깜빡이는 효과를 만들어 시각적 임팩트를 강화할 수 있다.

```csharp
IEnumerator BlinkEffect(int blinkCount)
{
    for (int i = 0; i < blinkCount; i++)
    {
        // 투명하게
        spriteRenderer.color = new Color(originalColor.r, originalColor.g, originalColor.b, 0.3f);
        yield return new WaitForSeconds(0.1f);

        // 원래대로
        spriteRenderer.color = originalColor;
        yield return new WaitForSeconds(0.1f);
    }
}
```

### 부드러운 이동 애니메이션

`Lerp` 함수와 코루틴을 조합하여 부드러운 이동 효과를 구현할 수 있다.

```csharp
IEnumerator SmoothMoveTo(Vector3 targetPosition, float duration)
{
    Vector3 startPosition = transform.position;
    float elapsedTime = 0f;

    while (elapsedTime < duration)
    {
        // 시간에 따른 보간
        float progress = elapsedTime / duration;
        transform.position = Vector3.Lerp(startPosition, targetPosition, progress);

        elapsedTime += Time.deltaTime;
        yield return null; // 매 프레임 실행
    }

    // 정확히 목표 위치로 설정
    transform.position = targetPosition;
}
```

### 웨이브 스포너 시스템

일정한 간격으로 적을 생성하는 웨이브 시스템도 코루틴으로 쉽게 구현할 수 있다.

```csharp
IEnumerator SpawnWave()
{
    for (int i = 0; i < enemiesPerWave; i++)
    {
        // 적 생성
        Instantiate(enemyPrefab, spawnPoint.position, Quaternion.identity);

        // 0.5초마다 생성
        yield return new WaitForSeconds(0.5f);
    }

    Debug.Log("웨이브 완료!");
}
```

---

## 코루틴 주의사항

### 코루틴 중단 처리

코루틴을 안전하게 관리하려면 적절한 중단 처리가 필요하다.

```csharp
public class Enemy : MonoBehaviour
{
    private Coroutine flashCoroutine;

    public void TakeDamage(int damage)
    {
        // 기존 코루틴이 있다면 중단
        if (flashCoroutine != null)
        {
            StopCoroutine(flashCoroutine);
        }

        // 새 코루틴 시작
        flashCoroutine = StartCoroutine(HitFlash());
    }

    void OnDestroy()
    {
        // 오브젝트 파괴 시 코루틴도 중단
        if (flashCoroutine != null)
        {
            StopCoroutine(flashCoroutine);
        }
    }
}
```

### 성능 최적화

**WaitForSeconds** 객체를 매번 새로 생성하면 가비지 컬렉션(GC) 부담이 증가한다. 캐싱을 통해 성능을 개선할 수 있다.

```csharp
// ❌ 매번 새 객체 생성 (GC 부담)
yield return new WaitForSeconds(0.1f);

// ✅ 캐싱해서 재사용
private WaitForSeconds hitFlashWait;

void Awake()
{
    hitFlashWait = new WaitForSeconds(hitFlashDuration);
}

IEnumerator HitFlash()
{
    spriteRenderer.color = hitColor;
    yield return hitFlashWait; // 재사용
    spriteRenderer.color = originalColor;
}
```

> 자주 사용되는 WaitForSeconds 객체는 미리 캐싱해두면 성능상 이점을 얻을 수 있다.
{: .prompt-info }

---

## 탑뷰 슈팅 게임에서의 활용

### 무적 시간 구현

피격 후 짧은 무적 시간을 구현할 때 코루틴이 매우 유용하다.

```csharp
IEnumerator InvincibilityFrames(float duration)
{
    isInvincible = true;

    // 깜빡이는 효과와 함께 무적
    StartCoroutine(BlinkEffect(duration));

    yield return new WaitForSeconds(duration);

    isInvincible = false;
}
```

### 자동 사격 시스템

지속적인 자동 사격 기능도 코루틴으로 간단히 구현할 수 있다.

```csharp
IEnumerator AutoShoot()
{
    while (isAlive)
    {
        // 총알 발사
        FireBullet();

        // 발사 간격만큼 대기
        yield return new WaitForSeconds(fireRate);
    }
}
```

---

## 핵심 포인트

코루틴을 효과적으로 활용하기 위해 다음 사항들을 기억해야 한다:

**시간 기반 작업**에 최적화되어 있어 애니메이션, 효과, 타이밍 제어에 탁월하다. **비동기적 처리**를 쉽게 구현할 수 있어 복잡한 콜백 구조 없이도 직관적인 코드 작성이 가능하다. 

**가독성이 뛰어나** 코드 유지보수가 용이하며, **Unity 생명주기**와 잘 통합되어 있다. 다만 **메모리 관리**에 주의를 기울여야 하며, 불필요한 객체 생성을 피하고 적절한 코루틴 중단 처리를 해야 한다.

> 코루틴은 Unity 게임 개발에서 시각적 효과, 타이밍 제어, 단계적 처리에 매우 강력한 도구이다.
{: .prompt-tip }
