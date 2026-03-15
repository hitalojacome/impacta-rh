using ImpactaRH.Api.Data;
using ImpactaRH.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ImpactaRH.Api.Controllers;
[ApiController]
[Route("api/[controller]")]
public class FuncionariosController : ControllerBase
{
    private readonly AppDbContext _context;

    public FuncionariosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Funcionario>>> Get()
    {
        var funcionarios = await _context.Funcionarios
            .OrderByDescending(f => f.DataCadastro)
            .ToListAsync();

        return Ok(funcionarios);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Funcionario>> GetById(int id)
    {
        var funcionario = await _context.Funcionarios.FindAsync(id);

        if (funcionario == null)
            return NotFound(new { mensagem = "Funcionário não encontrado." });

        return Ok(funcionario);
    }

    [HttpPost]
    public async Task<ActionResult> Post(Funcionario funcionario)
    {
        var emailExiste = await _context.Funcionarios.AnyAsync(f => f.Email == funcionario.Email);
        if (emailExiste)
            return BadRequest(new { mensagem = "Já existe um funcionário com este e-mail." });

        var cpfExiste = await _context.Funcionarios.AnyAsync(f => f.CPF == funcionario.CPF);
        if (cpfExiste)
            return BadRequest(new { mensagem = "Já existe um funcionário com este CPF." });

        funcionario.DataCadastro = DateTime.Now;

        _context.Funcionarios.Add(funcionario);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = funcionario.Id }, funcionario);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Put(int id, Funcionario funcionario)
    {
        var funcionarioExistente = await _context.Funcionarios.FindAsync(id);

        if (funcionarioExistente == null)
            return NotFound(new { mensagem = "Funcionário não encontrado." });

        var emailExiste = await _context.Funcionarios
            .AnyAsync(f => f.Email == funcionario.Email && f.Id != id);

        if (emailExiste)
            return BadRequest(new { mensagem = "Já existe um funcionário com este e-mail." });

        var cpfExiste = await _context.Funcionarios
            .AnyAsync(f => f.CPF == funcionario.CPF && f.Id != id);

        if (cpfExiste)
            return BadRequest(new { mensagem = "Já existe um funcionário com este CPF." });

        funcionarioExistente.Nome = funcionario.Nome;
        funcionarioExistente.Email = funcionario.Email;
        funcionarioExistente.CPF = funcionario.CPF;
        funcionarioExistente.Cargo = funcionario.Cargo;

        await _context.SaveChangesAsync();

        return Ok(funcionarioExistente);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var funcionario = await _context.Funcionarios.FindAsync(id);

        if (funcionario == null)
            return NotFound(new { mensagem = "Funcionário não encontrado." });

        _context.Funcionarios.Remove(funcionario);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}