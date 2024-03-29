using System;
using API.Extensions;
using API.Middleware;
using API.SignalR;
using Application.Activities;
using Application.Core;
using FluentValidation.AspNetCore;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Presistence;

namespace API
{
    public class Startup
    {
        private readonly IConfiguration _config;
        public Startup(IConfiguration configuration)
        {
            _config = configuration;

        }



        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllers(opt =>
            {
                var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                opt.Filters.Add(new AuthorizeFilter(policy));
            })
            .AddFluentValidation(cfg =>
            {
                cfg.RegisterValidatorsFromAssemblyContaining<Create>();
            });

            services.AddApplicationServices(_config);
            services.AddIdentityServices(_config);

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseMiddleware<ExceptionMiddleware>();

            app.UseXContentTypeOptions();

            app.UseReferrerPolicy(opt => opt.NoReferrer());

            app.UseXXssProtection(opt => opt.EnabledWithBlockMode());

            app.UseXfo(opt => opt.Deny());

            app.UseCsp(opt => opt
                    .BlockAllMixedContent()
                    .StyleSources(s => s.Self().CustomSources("https://fonts.googleapis.com",
                                                              "sha256-2aahydUs+he2AO0g7YZuG67RGvfE9VXGbycVgIwMnBI="))
                    .FontSources(s => s.Self().CustomSources("https://fonts.gstatic.com","data:"))
                    .FormActions(s => s.Self())
                    .FrameAncestors(s => s.Self())
                    .ImageSources(s => s.Self().CustomSources("https://res.cloudinary.com",
                                                              "https://www.facebook.com",
                                                              "https://platform-lookaside.fbsbx.com",
                                                              "https://scontent.fdel1-3.fna.fbcdn.net",
                                                              "https://scontent-lht6-1.xx.fbcdn.net",
                                                              "data:"))
                    .ScriptSources(s => s.Self().CustomSources("sha256-k3HH75zEEgPhExh/S0IxNWwek9JVjhzaEaaicZDIuiM=",
                                                               "https://connect.facebook.net",
                                                               "sha256-ROMlXmBL7gEqTs6lTOQ19dMa3eBPT4IBadtPMxGS+OE="))
            );

            if (env.IsDevelopment())
            {
                //app.UseDeveloperExceptionPage();

                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));
            }
            else
            {
                app.Use(async (context, next) =>
                {
                    context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000");
                    await next.Invoke();
                });
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseDefaultFiles();

            app.UseStaticFiles();

            app.UseCors("CorsPolicy");

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<ChatHub>("/chat");
                endpoints.MapFallbackToController("Index", "Fallback");
            });
        }
    }
}
