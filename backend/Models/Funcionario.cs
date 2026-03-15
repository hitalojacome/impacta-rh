using System.ComponentModel.DataAnnotations;

namespace ImpactaRH.Api.Models;
public class Funcionario
{
    public int Id { get; set; }

    [Required]
    [MaxLength(150)]
    public string Nome { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(11)]
    public string CPF { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Cargo { get; set; } = string.Empty;

    public DateTime DataCadastro { get; set; } = DateTime.Now;
}