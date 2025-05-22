---
title: DirecX12 개인 메모 | Root Signature
date: 2025-05-22 15:23:00 +0900
categories: [Rendering, Rendering\DirectX]
tags: [DX12, RootSignature, Pipeline, Note]
author: "rniman"                            # for single entry
# or
# authors: [<author1_id>, <author2_id>]   # for multiple entries
description: "DirectX12  Root Signature에 관한 글입니다."

comments: false # 댓글 기능
---

이 문서는 Direct3D 12에 Root Signature와 Root Parameter에 대해 정리한 글입니다.

---

## **Root Signature**

루트 시그니처(Root Signature)는 **그래픽스 파이프라인의 셰이더가 접근할 수 있는 리소스**를 정의한다.

셰이더에서 사용할 상수(Constant), 버퍼(Buffer), 텍스처(Texture) 등을 **어떤 방식으로 연결할 것인지** 기술하는 것이다.

- 어떤 자원이 바인딩되는지, 몇 개의 전역 변수가 있는지, 어떤 구조로 이루어져 있는지를 명시한다.
- 루트 시그니처 구성에 따라 파이프라인 상태 객체(PSO)도 달라지며 여러개의 PSO가 생길 수 있다.
- 다양한 셰이더 조합이나 리소스 바인딩 최적화를 위해 여러 Root Signature가 사용될 수도 있다.

![root-tables-3.png](assets/img/DX12/RootSignature/root-tables-3.png)

## Root Parameter

루트 시그니처는 최대 **64개의 32비트 슬롯(DWORD)**으로 구성된다.

자주 변경되는 리소스일수록 앞쪽에 배치하면 GPU 접근 성능을 최적화 할 수 있다고 한다.

- **Root Constant**(32bit x N): 배열에 상수 값을 기록해서 쓴다.
    - GPU에 바로 값이 복사됨
    - 빠르게 접근 가능, 가장 저비용의 바인딩 방식
    - 예: 프레임별로 변경되는 소량의 상수 데이터
    
    ![root-tables-constant.png](assets/img/DX12/RootSignature/root-tables-constant.png)

- **Root Descriptor**(64bit)
    - 디스크립터 힙 없이 GPU 버퍼(Resource)에 직접 접근
    - Root 자체가 힙 역할을 한다.
    - 예: CBV 하나를 루트에서 직접 지정하여 사용
    - CBV → Draw사이에 바뀔 것들로 Upload, 최대 4096개의 벡터를 보관 가능 (Const의 의미 → Draw함수가 실행되는 동안 바뀌지 않음)
    
    > ⚠ Draw 호출 시 자주 변경되는 CBV에 적합하다.
    단, **루트 슬롯의 비용이 크므로 남용은 주의**
    > 
    
    ![root-tables-cbv.png](assets/img/DX12/RootSignature/root-tables-cbv.png)
    
- Descriptor Table(32bit)
    - 디스크립터 힙을 가리키는 포인터 테이블
    - 여러 개의 리소스를 **한 번에 바인딩**할 수 있다.
    - 주로 SRV, UAV, CBV 등을 묶어 사용한다.
    
    ![root-tables-2.png](assets/img/DX12/RootSignature/root-tables-2.png)
    

## 기타 개념

### Streaming Shader Resource View

- CPU가 지속적으로 업데이트하는 데이터(SRV)를 GPU에서 참조
- 예: 실시간 변동 데이터를 셰이더에 반영하고자 할 때
    
    ![root-tables-4.png](assets/img/DX12/RootSignature/root-tables-4.png)
    

### Bindless Resources ⭐️

- 매우 많은 리소스를 바인딩 슬롯에 제한 없이 사용 가능
- 인덱스를 기반으로 셰이더 내부에서 리소스를 선택
- DX12 + Shader Model 6.6 이상에서 본격적인 지원

---

## 참고
이미지 출처: [https://learn.microsoft.com/en-us/windows/win32/direct3d12/example-root-signatures](https://learn.microsoft.com/en-us/windows/win32/direct3d12/example-root-signatures)
