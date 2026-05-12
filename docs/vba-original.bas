' Original VBA macro extracted from "Qual o Minério 3.xlsm" (Módulo4).
' Used as the contract for `lib/filter.ts`.
' Verbatim copy via olevba — DO NOT MODIFY (this is a reference document).

Attribute VB_Name = "Módulo4"
Sub FilterMinerals()

    ' Obter seleções do usuário
    Dim selectedBrilho As String
    selectedBrilho = Sheets("Qual o Mineral").Range("G8").Value

    Dim selectedTraco As String
    selectedTraco = Sheets("Qual o Mineral").Range("G11").Value

    Dim selectedDureza As String
    selectedDureza = Sheets("Qual o Mineral").Range("G15").Value

    Dim selectedDurezaMinima As Double
    Dim selectedDurezaMaxima As Double

    ' Interpretar o valor de dureza
    If selectedDureza Like "<*" Then
        selectedDurezaMinima = 0
        selectedDurezaMaxima = Val(Mid(selectedDureza, 2))
    ElseIf selectedDureza Like ">=*e<*" Then
        Dim parts() As String
        parts = Split(Replace(Replace(selectedDureza, " ", ""), ">=<", ""), "e<")
        selectedDurezaMinima = Val(parts(0))
        selectedDurezaMaxima = Val(parts(1))
    ElseIf selectedDureza Like ">=*" Then
        selectedDurezaMinima = Val(Mid(selectedDureza, 3))
        selectedDurezaMaxima = 999
    Else
        MsgBox "Formato de dureza não reconhecido. Use formatos como '< 2,5', '>= 2,5 e < 5,5', '>= 5,5 e < 7' ou '>= 7'.", vbExclamation
        Exit Sub
    End If

    Dim selectedHabito As String
    selectedHabito = Sheets("Qual o Mineral").Range("G19").Value

    Dim selectedLuz As String
    selectedLuz = Sheets("Qual o Mineral").Range("G23").Value

    Dim selectedCor As String
    selectedCor = Sheets("Qual o Mineral").Range("G26").Value

    ' Limpar a lista de minerais previamente exibida (se houver)
    Sheets("Qual o Mineral").Range("J12:J" & Sheets("Qual o Mineral").Range("J" & Rows.Count).End(xlUp).Row).ClearContents

    ' Filtrar minerais na aba "Dados Minerais"
    Dim mineralRow As Long
    Dim outputRow As Long
    outputRow = 12
    Dim encontrado As Boolean
    encontrado = False

    For mineralRow = 2 To Sheets("Dados Minerais").Range("A" & Rows.Count).End(xlUp).Row
        Dim durezaMineral As Double
        durezaMineral = Val(Sheets("Dados Minerais").Range("E" & mineralRow).Value)

        If Sheets("Dados Minerais").Range("C" & mineralRow).Value = selectedBrilho And _
           Sheets("Dados Minerais").Range("D" & mineralRow).Value = selectedTraco And _
           durezaMineral >= selectedDurezaMinima And _
           durezaMineral < selectedDurezaMaxima And _
           Sheets("Dados Minerais").Range("G" & mineralRow).Value = selectedHabito And _
           Sheets("Dados Minerais").Range("H" & mineralRow).Value = selectedLuz And _
           Sheets("Dados Minerais").Range("I" & mineralRow).Value = selectedCor Then
            Sheets("Qual o Mineral").Range("J" & outputRow).Value = Sheets("Dados Minerais").Range("A" & mineralRow).Value
            outputRow = outputRow + 1
            encontrado = True
        End If
    Next mineralRow

    If Not encontrado Then
        MsgBox "Nenhum mineral encontrado com os critérios fornecidos.", vbInformation
    Else
        MsgBox "Minerais encontrados com sucesso.", vbInformation
    End If

End Sub

' AbrirPlanilhaMineral — abre o .XLS individual ao clicar num resultado.
' Confirma o naming: arquivo é o primeiro espaço-separado-token do valor da célula.
' Ex: "OURO Au" → "OURO" → "OURO.xls"
Sub AbrirPlanilhaMineral()
    Dim ws As Worksheet
    Dim mineralSelecionado As String
    Dim caminhoPlanilha As String
    Dim rng As Range
    Dim cell As Range

    Set ws = ThisWorkbook.Sheets("Qual o mineral")
    Set rng = ws.Range("J12:J" & ws.Cells(ws.Rows.Count, 10).End(xlUp).Row)

    Set cell = Intersect(Selection, rng)
    If cell Is Nothing Then Exit Sub

    mineralSelecionado = Split(cell.Value, " ")(0)
    caminhoPlanilha = "C:\Programa de mineração - excel\" & mineralSelecionado & ".xls"

    If Dir(caminhoPlanilha) <> "" Then
        Workbooks.Open (caminhoPlanilha)
    End If
End Sub
